import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Resource } from '../../services/scholarship';

@Component({
  selector: 'app-cms-resources',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="cms-resources-manager-canvas" class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mt-8 text-slate-200">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div class="flex items-center gap-2">
          <mat-icon class="!w-5 !h-5 !text-[20px] text-indigo-400">auto_stories</mat-icon>
          <h2 class="text-base font-display font-bold text-slate-100">Public Resources & Knowledge Base Manager</h2>
        </div>
        <button (click)="onStartCreate()"
                *ngIf="!isEditing()"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 border border-white/10 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer">
          <mat-icon class="!w-4 !h-4 !text-[15px]">add_box</mat-icon>
          <span>Create New Resource</span>
        </button>
      </div>

      <!-- Editor Panel (Add/Edit Resource) -->
      @if (isEditing()) {
        <div class="border border-white/10 bg-slate-900/40 rounded-xl p-5 mb-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span class="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              {{ editId() ? 'Modify Knowledge Resource' : 'Publish New Resource Guide' }}
            </span>
            <button (click)="onCancelEdit()" 
                    class="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <mat-icon class="!w-4 !h-4 !text-[16px]">close</mat-icon>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Left Side: Inputs -->
            <div class="space-y-4 font-sans text-xs">
              <div>
                <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">RESOURCE TITLE</label>
                <input type="text" #resTitleInput [value]="formTitle()" (input)="onTitleInput(resTitleInput.value)"
                       placeholder="e.g. 5 Secrets to Writing a Winning Scholarship Essay"
                       class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-950 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">CATEGORY CLASSIFICATION</label>
                  <select #resCategorySelect [value]="formCategory()" (change)="formCategory.set(resCategorySelect.value)"
                          class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-950 text-slate-200 focus:outline-none cursor-pointer">
                    <option value="Guide">Detailed Guide</option>
                    <option value="Tip">Quick Tip</option>
                    <option value="FAQ">Frequently Asked Question (FAQ)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">PUBLICATION STATUS</label>
                  <select #resStatusSelect [value]="formStatus()" (change)="formStatus.set(resStatusSelect.value)"
                          class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-950 text-slate-200 focus:outline-none cursor-pointer">
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden to public)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">EXCERPT (SHORT SUMMARY FOR MAIN DIRECTORY CARD)</label>
                <textarea #resExcerptText [value]="formExcerpt()" (input)="formExcerpt.set(resExcerptText.value)"
                          rows="3"
                          placeholder="Provide a concise summary outlining what the applicant will learn..."
                          class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-950 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-y"></textarea>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-mono font-semibold text-slate-500">MARKDOWN CONTENT DETAILS</label>
                  <span class="text-[9px] font-mono text-slate-500">Supports ## H2, ### H3, - list, **bold**</span>
                </div>
                <textarea #resContentText [value]="formContent()" (input)="formContent.set(resContentText.value)"
                          rows="10"
                          placeholder="Write the full body using markdown..."
                          class="w-full px-3 py-2 text-xs font-mono rounded-lg border border-white/10 bg-slate-950 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-y"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button (click)="onCancelEdit()" 
                        class="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button (click)="onSaveResource()" 
                        [disabled]="!formTitle().trim() || !formContent().trim()"
                        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white font-semibold text-xs rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  {{ editId() ? 'Apply Modifications' : 'Publish Resource' }}
                </button>
              </div>
            </div>

            <!-- Right Side: Live HTML Markdown Preview -->
            <div class="border border-white/5 bg-slate-950/60 rounded-lg p-4 flex flex-col">
              <span class="text-[10px] font-mono font-bold text-slate-500 mb-3 tracking-wider block border-b border-white/5 pb-2">LIVE CMS PREVIEW RENDER</span>
              
              <div class="flex-grow overflow-y-auto max-h-[480px] pr-2">
                <div class="flex items-center gap-2 mb-3">
                  <span [class]="getCategoryClass(formCategory())">
                    {{ formCategory() }}
                  </span>
                  <span class="text-[9px] font-mono text-slate-400">Views: {{ formViews() }} (initial)</span>
                  <span class="text-[9px] font-mono text-slate-400">| Status: {{ formStatus() }}</span>
                </div>
                <h1 class="text-lg font-display font-black text-white mb-3">
                  {{ formTitle() || 'Untitled Document' }}
                </h1>
                <p class="text-xs text-indigo-300 bg-indigo-500/5 border-l-2 border-indigo-500 p-2.5 rounded-r-lg mb-5 italic" *ngIf="formExcerpt()">
                  {{ formExcerpt() }}
                </p>
                <div class="markdown-preview text-slate-300 text-xs leading-relaxed" 
                     [innerHTML]="previewHtml()">
                </div>
              </div>
            </div>

          </div>
        </div>
      }

      <!-- Listing Workspace Search Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 bg-slate-900/30 rounded-xl p-4 mb-6">
        <!-- Search -->
        <div class="relative flex-grow max-w-md">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !w-4 !h-4 !text-[16px]">search</mat-icon>
          <input type="text" #searchText [value]="searchQuery()" (input)="searchQuery.set(searchText.value)"
                 placeholder="Filter resources by title, excerpt..."
                 class="w-full bg-slate-950 border border-white/8 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 font-sans" />
          <button *ngIf="searchQuery()" (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <mat-icon class="!w-4 !h-4 !text-[14px]">close</mat-icon>
          </button>
        </div>

        <!-- Filter tabs -->
        <div class="flex flex-wrap items-center gap-1">
          @for (cat of categories; track cat) {
            <button (click)="selectedCategory.set(cat)"
                    [class]="'px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ' + 
                             (selectedCategory() === cat 
                               ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300' 
                               : 'text-slate-400 hover:text-white hover:bg-white/[0.03]')">
              {{ cat }}s
            </button>
          }
        </div>
      </div>

      <!-- Resource Records Table -->
      <div class="overflow-x-auto border border-white/10 rounded-xl bg-slate-900/30">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-white/10 bg-white/[0.02]">
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px]">Title</th>
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category</th>
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px]">Reads</th>
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px]">Publish Date</th>
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th class="p-3.5 font-mono text-slate-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (res of filteredResources(); track res.id) {
              <tr class="hover:bg-white/[0.01] transition-colors">
                <td class="p-3.5">
                  <div class="flex flex-col">
                    <span class="font-bold text-white leading-snug">{{ res.title }}</span>
                    <span class="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{{ res.excerpt }}</span>
                  </div>
                </td>
                <td class="p-3.5 whitespace-nowrap">
                  <span [class]="getCategoryClass(res.category)">
                    {{ res.category }}
                  </span>
                </td>
                <td class="p-3.5 font-mono text-slate-300">
                  {{ res.views || 0 }}
                </td>
                <td class="p-3.5 text-slate-400">
                  {{ formatDate(res.publishedAt) }}
                </td>
                <td class="p-3.5 whitespace-nowrap">
                  <span [class]="res.status === 'published' ? 'text-emerald-400' : 'text-slate-400'">
                    {{ res.status }}
                  </span>
                </td>
                <td class="p-3.5 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Toggle draft/published -->
                    <button (click)="onToggleStatus(res)"
                            [title]="res.status === 'published' ? 'Switch to Draft' : 'Switch to Published'"
                            class="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-all cursor-pointer">
                      <mat-icon class="!w-4 !h-4 !text-[16px]">{{ res.status === 'published' ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <!-- Edit -->
                    <button (click)="onStartEdit(res)"
                            title="Edit content"
                            class="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
                      <mat-icon class="!w-4 !h-4 !text-[16px]">edit</mat-icon>
                    </button>
                    <!-- Delete -->
                    <button (click)="onDelete(res)"
                            title="Delete permanently"
                            class="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer">
                      <mat-icon class="!w-4 !h-4 !text-[16px]">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-500 font-sans">
                  No knowledge resources registered. Try creating one!
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </section>
  `,
  styles: [`
    .markdown-preview ::ng-deep h2 {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.15rem;
    }
    .markdown-preview ::ng-deep h3 {
      font-size: 0.825rem;
      font-weight: 600;
      color: #818cf8;
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
    }
    .markdown-preview ::ng-deep li {
      font-size: 0.75rem;
      color: #cbd5e1;
      margin-left: 0.75rem;
      margin-bottom: 0.25rem;
      list-style-type: disc;
    }
    .markdown-preview ::ng-deep strong {
      font-weight: 700;
      color: #ffffff;
    }
    .markdown-preview ::ng-deep p {
      margin-bottom: 0.5rem;
    }
    .markdown-preview ::ng-deep div.q-block {
      color: #a5b4fc;
      font-weight: 700;
      margin-top: 0.75rem;
      margin-bottom: 0.15rem;
    }
    .markdown-preview ::ng-deep div.a-block {
      color: #cbd5e1;
      padding-left: 0.5rem;
      border-left: 2px solid rgba(129, 140, 248, 0.3);
      margin-bottom: 0.75rem;
    }
  `]
})
export class CmsResourcesComponent {
  public svc = inject(ScholarshipService);

  // States
  public categories = ['All', 'Guide', 'Tip', 'FAQ'];
  public selectedCategory = signal<string>('All');
  public searchQuery = signal<string>('');

  // Form states
  public isEditing = signal<boolean>(false);
  public editId = signal<string | null>(null);
  public formTitle = signal<string>('');
  public formExcerpt = signal<string>('');
  public formCategory = signal<string>('Guide');
  public formStatus = signal<string>('published');
  public formContent = signal<string>('');
  public formViews = signal<number>(0);

  // Computed previews
  public previewHtml = computed(() => {
    const raw = this.formContent();
    if (!raw) return '<i>Content details preview will display here...</i>';

    let html = raw;
    // Replace markdown structures safely:
    html = html.replace(/^##\s*(.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^###\s*(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^\-\s*(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Q & A matches
    html = html.replace(/^Q:\s*(.*?)$/gm, '<div class="q-block">Q: $1</div>');
    html = html.replace(/^A:\s*(.*?)$/gm, '<div class="a-block">A: $1</div>');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<p></p>');

    return html;
  });

  // Filtered resources for CMS listing
  public filteredResources = computed(() => {
    let list = this.svc.resources();
    
    const cat = this.selectedCategory();
    if (cat !== 'All') {
      list = list.filter(r => r.category === cat);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.excerpt.toLowerCase().includes(query)
      );
    }

    // Sort by publish date desc
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  });

  // Action Methods
  public onStartCreate(): void {
    this.editId.set(null);
    this.formTitle.set('');
    this.formExcerpt.set('');
    this.formCategory.set('Guide');
    this.formStatus.set('published');
    this.formContent.set('');
    this.formViews.set(0);
    this.isEditing.set(true);
  }

  public onTitleInput(val: string): void {
    this.formTitle.set(val);
  }

  public onStartEdit(res: Resource): void {
    this.editId.set(res.id);
    this.formTitle.set(res.title);
    this.formExcerpt.set(res.excerpt);
    this.formCategory.set(res.category);
    this.formStatus.set(res.status);
    this.formContent.set(res.content);
    this.formViews.set(res.views || 0);
    this.isEditing.set(true);
  }

  public onCancelEdit(): void {
    this.isEditing.set(false);
  }

  public async onSaveResource(): Promise<void> {
    const title = this.formTitle().trim();
    const excerpt = this.formExcerpt().trim();
    const content = this.formContent().trim();
    const category = this.formCategory() as 'Guide' | 'Tip' | 'FAQ';
    const status = this.formStatus() as 'published' | 'draft';
    
    if (!title || !content) return;

    if (this.editId()) {
      // Modify
      const id = this.editId()!;
      await this.svc.updateResource(id, {
        title,
        excerpt,
        content,
        category,
        status
      });
    } else {
      // Create new
      const generatedId = title.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // Handle ID collision
      let finalId = generatedId;
      let count = 1;
      while (this.svc.resources().some(r => r.id === finalId)) {
        finalId = `${generatedId}-${count}`;
        count++;
      }

      const fresh: Resource = {
        id: finalId,
        title,
        excerpt,
        content,
        category,
        status,
        views: 0,
        publishedAt: new Date().toISOString()
      };
      
      await this.svc.addResource(fresh);
    }

    this.isEditing.set(false);
  }

  public async onToggleStatus(res: Resource): Promise<void> {
    const nextStatus = res.status === 'published' ? 'draft' : 'published';
    await this.svc.updateResource(res.id, { status: nextStatus });
  }

  public async onDelete(res: Resource): Promise<void> {
    if (confirm(`Are you sure you want to permanently delete the resource: "${res.title}"?`)) {
      await this.svc.deleteResource(res.id);
    }
  }

  public getCategoryClass(cat: string): string {
    switch (cat) {
      case 'Guide':
        return 'px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight bg-purple-500/10 border border-purple-500/20 text-purple-400';
      case 'Tip':
        return 'px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'FAQ':
        return 'px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight bg-indigo-500/10 border border-indigo-500/20 text-indigo-400';
      default:
        return 'px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight bg-slate-500/10 border border-slate-500/20 text-slate-400';
    }
  }

  public formatDate(isoString?: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
