import { Component, inject, signal, computed, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-cms-table',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Interactive Articles Index Grid Table (Glassmorphic) -->
    <section class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
      
      <div class="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 class="text-sm font-display font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">list_alt</mat-icon>
          <span>Manage Scholarship Index</span>
        </h2>

        <!-- Fast search inside list and category controls -->
        <div class="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <!-- Category select filtering control -->
          <div class="relative w-full sm:w-44">
            <select [value]="listCategoryFilter()" (change)="listCategoryFilter.set($any($event.target).value)"
                    class="w-full px-3.5 py-2 text-xs rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 appearance-none pr-8 font-sans">
              <option value="All" class="bg-slate-950 text-slate-200">All Categories</option>
              @for (cat of svc.categories(); track cat) {
                <option [value]="cat" class="bg-slate-950 text-slate-200">{{ cat }}</option>
              }
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <mat-icon class="!w-3 !h-3 !text-[12px]">keyboard_arrow_down</mat-icon>
            </span>
          </div>

          <!-- Status select filtering control -->
          <div class="relative w-full sm:w-36">
            <select [value]="listStatusFilter()" (change)="listStatusFilter.set($any($event.target).value)"
                    class="w-full px-3.5 py-2 text-xs rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 appearance-none pr-8 font-sans">
              <option value="All" class="bg-slate-950 text-slate-200">All Statuses</option>
              <option value="published" class="bg-slate-950 text-slate-200">Published</option>
              <option value="draft" class="bg-slate-950 text-slate-200">Draft</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <mat-icon class="!w-3 !h-3 !text-[12px]">keyboard_arrow_down</mat-icon>
            </span>
          </div>

          <!-- Fast search by text query -->
          <div class="relative w-full sm:w-60 flex items-center">
            <span class="absolute left-3 text-slate-400">
              <mat-icon class="!w-4 !h-4 !text-[16px]">search</mat-icon>
            </span>
            <input type="text" [value]="listQuery()" (input)="onListQueryInput($event)"
                   placeholder="Filter listing by title..."
                   class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 font-sans" />
          </div>
        </div>
      </div>

      <!-- Document List Desk -->
      @if (filteredList().length === 0) {
        <div class="p-12 text-center text-slate-500">
          <mat-icon class="!w-8 !h-8 !text-[32px] text-slate-500 mb-2">folder_open</mat-icon>
          <p class="text-xs">No matching articles inside this filtered index.</p>
        </div>
      } @else {
        
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left text-xs border-collapse">
            
            <thead>
              <tr class="bg-slate-950/60 text-slate-400 font-mono text-[10px] uppercase border-b border-white/10">
                <th class="py-3 px-6">Opportunity</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-3 text-center"><mat-icon class="!w-4 !h-4 !text-[14px] text-amber-400">star</mat-icon></th>
                <th class="py-3 px-3 text-center">Region</th>
                <th class="py-3 px-4">Deadline</th>
                <th class="py-3 px-4 text-center">Views</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-6 text-center">Operations</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-white/10 font-sans">
              @for (item of filteredList(); track item.id) {
                <tr class="hover:bg-white/5 transition-colors">
                  
                  <!-- Thumbnail + title -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&q=80'" 
                           alt="" class="h-8 w-12 rounded object-cover flex-shrink-0 bg-slate-900 border border-white/10"
                           referrerpolicy="no-referrer" />
                      <div>
                        <span class="font-semibold text-slate-200 block leading-tight">{{ item.title }}</span>
                        <span class="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {{ item.id }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Category -->
                  <td class="py-4 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold capitalize bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      {{ item.category }}
                    </span>
                  </td>

                  <!-- Featured star -->
                  <td class="py-4 px-3 text-center">
                    @if (item.featured) {
                      <mat-icon class="!w-4 !h-4 !text-[15px] text-amber-400" title="Featured Staff Pick">star</mat-icon>
                    } @else {
                      <span class="text-slate-500 text-[10px]">—</span>
                    }
                  </td>

                  <!-- Country/Region -->
                  <td class="py-4 px-3 text-center">
                    @if (item.country) {
                      <span class="text-[10px] font-mono font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">{{ item.country }}</span>
                    } @else {
                      <span class="text-slate-500 text-[10px]">—</span>
                    }
                  </td>

                  <!-- Deadline date -->
                  <td class="py-4 px-4">
                    <span class="text-rose-400 font-mono text-[11px]">
                      {{ item.deadline | date:'mediumDate' }}
                    </span>
                  </td>

                  <!-- View count -->
                  <td class="py-4 px-4 text-center font-mono font-semibold text-slate-300">
                    {{ item.views }}
                  </td>

                  <!-- Draft or published status -->
                  <td class="py-4 px-4 text-center">
                    @if (item.status === 'published') {
                      <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Published"></span>
                    } @else {
                      <span class="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Draft"></span>
                    }
                  </td>

                  <!-- Edit and Delete actions -->
                  <td class="py-4 px-6 text-center">
                    <div class="flex items-center justify-center gap-2">
                      @if (item.status === 'draft') {
                        <button (click)="onApprove(item)" title="Approve & Publish"
                                class="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 transition-colors focus:outline-none cursor-pointer">
                          <mat-icon class="!w-4 !h-4 !text-[15px]">check_circle</mat-icon>
                        </button>
                      }
                      
                      <button (click)="onEdit(item)" title="Edit properties"
                              class="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 transition-colors focus:outline-none cursor-pointer">
                        <mat-icon class="!w-4 !h-4 !text-[15px]">edit</mat-icon>
                      </button>
                      
                      <button (click)="onDelete(item)" title="Delete scholarship"
                              class="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-rose-500 transition-colors focus:outline-none cursor-pointer">
                        <mat-icon class="!w-4 !h-4 !text-[15px]">delete</mat-icon>
                      </button>

                    </div>
                  </td>

                </tr>
              }
            </tbody>

          </table>
        </div>

      }

    </section>
  `
})
export class CmsTableComponent {
  public svc = inject(ScholarshipService);

  @Output() editClick = new EventEmitter<Scholarship>();

  // Table index search signals
  public listQuery = signal<string>('');
  public listCategoryFilter = signal<string>('All');
  public listStatusFilter = signal<string>('All');
  
  public filteredList = computed(() => {
    let list = this.svc.scholarships();
    
    // 1. Filter by category
    const catFilter = this.listCategoryFilter();
    if (catFilter !== 'All') {
      list = list.filter(s => s.category === catFilter);
    }

    // 2. Filter by status
    const statFilter = this.listStatusFilter();
    if (statFilter !== 'All') {
      list = list.filter(s => s.status === statFilter);
    }
    
    // 3. Filter by search query
    const queryStr = this.listQuery().trim().toLowerCase();
    if (!queryStr) return list;
    
    return list.filter(s => s.title.toLowerCase().includes(queryStr));
  });

  public onListQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.listQuery.set(value);
  }

  public onEdit(item: Scholarship): void {
    this.editClick.emit(item);
  }

  public async onApprove(item: Scholarship): Promise<void> {
    try {
      await this.svc.updateScholarship(item.id, { status: 'published' });
      this.svc.showToast('success', 'Approved & Published', `"${item.title}" is now live!`);
    } catch (err: unknown) {
      console.error('Failed to approve draft:', err);
    }
  }

  public async onDelete(item: Scholarship): Promise<void> {
    if (confirm(`Are you absolutely sure you want to delete "${item.title}"? This process is irreversible.`)) {
      try {
        await this.svc.deleteScholarship(item.id);
      } catch (err: unknown) {
        console.error('Database deletion action rejected:', err);
      }
    }
  }
}
