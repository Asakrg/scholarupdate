import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { ScholarshipCardComponent } from './components/scholarship-card';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, MatIconModule, HeaderComponent, FooterComponent, ScholarshipCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Categories Canvas Layout with background glass blobs (no gradient colors) -->
    <div id="categories-root-desk" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden z-10">
      
      <!-- Glow background glass blobs (Solid color circular layers with extreme blur, no gradients allowed) -->
      <div class="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/15 blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute top-[30%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-[-10%] left-[5%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none -z-10"></div>

      <!-- Sticky Navigation Header -->
      <app-header />

      <!-- Main Taxonomy Workspace -->
      <main class="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <!-- Headers Segment (Glassmorphic) -->
        <header class="max-w-3xl mx-auto text-center mb-10 bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-3xl p-6 sm:p-8 relative">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/10 text-indigo-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-4">
            <mat-icon class="!w-3.5 !h-3.5 !text-[12px] text-indigo-400 animate-pulse">category</mat-icon>
            <span>Explore Academic Taxonomy System</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-2">
            Scholarship Classifications
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Browse active grant programs organized by their funding tier and topical tags. Authenticated academic directors can dynamically add or prune metadata categories and tags to retrain our AI crawler.
          </p>
        </header>



        <!-- Admin Control Desk (Displays dynamic category and tag management if authorized) -->
        <div id="taxonomy-admin-section" class="mb-12">
          @if (svc.isAuthorizedAdmin()) {
            <div class="bg-slate-950/75 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto shadow-black/50">
              
              <!-- Dashboard Header -->
              <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div class="flex items-center gap-2">
                  <span class="p-1 rounded bg-white/10 text-white border border-white/10 backdrop-blur-sm">
                    <mat-icon class="!w-4 !h-4 !text-[16px] block">admin_panel_settings</mat-icon>
                  </span>
                  <div>
                    <h2 class="text-xs font-mono font-bold text-white uppercase tracking-widest leading-none">Taxonomy Editor Active</h2>
                    <p class="text-[10px] text-slate-400 mt-1">Changes here synchronize immediately to the platform indexing database and the AI search crawler.</p>
                  </div>
                </div>
                
                <span class="px-2.5 py-0.5 rounded text-[9px] font-mono bg-indigo-950/80 text-indigo-200 font-semibold uppercase tracking-wider backdrop-blur-sm border border-indigo-500/30">
                  Admin Master
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Category Management Block -->
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">edit_note</mat-icon>
                      <span>Manage Category Entries</span>
                    </h3>
                    
                    <!-- Add Category Form -->
                    <div class="flex gap-2">
                      <input type="text" #newCatInput placeholder="e.g. Master-Minds"
                             (keyup.enter)="handleAddCategory(newCatInput)"
                             class="flex-grow px-3 py-2 text-xs rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 bg-white/5 focus:bg-white/10 text-white placeholder-slate-400" />
                      <button (click)="handleAddCategory(newCatInput)"
                              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                        Add
                      </button>
                    </div>
                  </div>

                  <!-- Category List table -->
                  <div class="max-h-52 overflow-y-auto border border-white/10 rounded-xl divide-y divide-white/10 bg-slate-900/50 backdrop-blur-xl">
                    @for (cat of svc.categories(); track cat) {
                      <div class="px-3 py-2.5 flex items-center justify-between text-xs">
                        <span class="font-semibold text-white">{{ cat }}</span>
                        
                        <div class="flex items-center gap-2">
                          <span class="text-[10px] font-mono text-slate-400">
                            {{ getCategoryScholarshipCount(cat) }} items
                          </span>
                          <button (click)="handleDeleteCategory(cat)"
                                  class="text-slate-400 hover:text-rose-400 focus:outline-none cursor-pointer transition-colors"
                                  title="Delete Category">
                            <mat-icon class="!w-4 !h-4 !text-[15px]">delete_sweep</mat-icon>
                          </button>
                        </div>
                      </div>
                    } @empty {
                      <p class="p-4 text-center text-[11px] text-slate-500 font-mono">No category tags inside workspace.</p>
                    }
                  </div>
                </div>

                <!-- Tag Management Block -->
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">sell</mat-icon>
                      <span>Manage Tags Entries</span>
                    </h3>
                    
                    <!-- Add Tag Form -->
                    <div class="flex gap-2">
                      <input type="text" #newTagInput placeholder="e.g. Europe"
                             (keyup.enter)="handleAddTag(newTagInput)"
                             class="flex-grow px-3 py-2 text-xs rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 bg-white/5 focus:bg-white/10 text-white placeholder-slate-400" />
                      <button (click)="handleAddTag(newTagInput)"
                              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                        Add
                      </button>
                    </div>
                  </div>

                  <!-- Tag List table -->
                  <div class="max-h-52 overflow-y-auto border border-white/10 rounded-xl bg-slate-900/50 backdrop-blur-xl p-2.5">
                    <div class="flex flex-wrap gap-1.5">
                      @for (tag of svc.tags(); track tag) {
                        <span class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-950/70 border border-white/10 text-slate-300 text-[10px] font-mono font-medium backdrop-blur-sm">
                          <span>#{{ tag }}</span>
                          <button (click)="handleDeleteTag(tag)"
                                  class="text-slate-400 hover:text-rose-400 focus:outline-none cursor-pointer transition-colors"
                                  title="Delete Tag">
                            <mat-icon class="!w-3 !h-3 !text-[11px] font-bold">close</mat-icon>
                          </button>
                        </span>
                      } @empty {
                        <p class="p-4 w-full text-center text-[11px] text-slate-500 font-mono">No tags indexed inside workspace.</p>
                      }
                    </div>
                  </div>
                </div>

              </div>

            </div>
          }
        </div>

        <!-- Directory Category Filter Cards Section -->
        <h2 class="text-sm font-display font-black text-white uppercase tracking-wider mb-6 flex items-center gap-1.5 max-w-4xl mx-auto">
          <mat-icon class="!w-4 !h-4 !text-[18px]">grid_view</mat-icon>
          <span>Select Classification to Browse</span>
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto mb-10">
          <!-- All Card -->
          <div (click)="selectedCategory.set('All'); selectedTag.set(null)"
               [id]="'category-card-all'"
               [class]="'p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 backdrop-blur-xl shadow-sm ' +
                        (selectedCategory() === 'All' && !selectedTag()
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                          : 'bg-slate-950/70 text-slate-300 border-white/10 hover:bg-slate-900/80 hover:border-indigo-500/30 hover:text-white shadow-black/30')">
            <h3 class="text-[9px] font-mono font-bold text-slate-400 leading-none mb-1.5 uppercase tracking-wide">Index Total</h3>
            <p class="text-md sm:text-lg font-display font-black tracking-tight leading-none mb-2">Show All</p>
            <span class="text-[9px] font-mono opacity-80 leading-none block">
              {{ svc.scholarships().length }} positions
            </span>
          </div>

          <!-- Dynamic Category Cards List -->
          @for (cat of svc.categories(); track cat) {
            <div (click)="selectedCategory.set(cat); selectedTag.set(null)"
                 [id]="'category-card-' + cat"
                 [class]="'p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 backdrop-blur-xl shadow-sm ' +
                          (selectedCategory() === cat && !selectedTag()
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                            : 'bg-slate-950/70 text-slate-300 border-white/10 hover:bg-slate-900/80 hover:border-indigo-500/30 hover:text-white shadow-black/30')">
              <h3 class="text-[9px] font-mono font-bold text-slate-400 leading-none mb-1.5 uppercase tracking-wide">Category</h3>
              <p class="text-md sm:text-lg font-display font-black tracking-tight leading-none mb-2 truncate" [title]="cat">{{ cat }}</p>
              <span class="text-[9px] font-mono opacity-80 leading-none block">
                {{ getCategoryScholarshipCount(cat) }} positions
              </span>
            </div>
          }
        </div>

        <!-- Tags Cloud Box (Glassmorphic) -->
        <div id="categories-tag-cloud" class="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl max-w-4xl mx-auto mb-12 shadow-black/40">
          <h3 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1 select-none">
            <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">sell</mat-icon>
            <span>Browse By Tag Matrix</span>
          </h3>

          <div class="flex flex-wrap gap-2">
            @for (tag of svc.tags(); track tag) {
              <button (click)="selectedTag.set(tag); selectedCategory.set('All')"
                      [class]="'px-3 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer focus:outline-none backdrop-blur-xl ' +
                               (selectedTag() === tag
                                 ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 font-bold shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                                 : 'bg-slate-950/70 text-slate-300 border-white/10 hover:bg-slate-900/80 hover:border-indigo-500/30 hover:text-white')">
                #{{ tag }} ({{ getTagScholarshipCount(tag) }})
              </button>
            } @empty {
              <p class="text-xs text-slate-500 font-mono">No tags available in dynamic registry.</p>
            }
          </div>
        </div>

        <!-- Filter context caption banner -->
        <div class="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-slate-500 font-bold">Active Scope:</span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold backdrop-blur-sm shadow-sm">
              @if (selectedTag()) {
                <span>Tag: #{{ selectedTag() }}</span>
              } @else {
                <span>Category: {{ selectedCategory() }}</span>
              }
            </span>
          </div>
          
          <span class="text-[10px] font-mono text-slate-500">
            Rendered {{ filteredScholarships().length }} matches inside standard grid
          </span>
        </div>

        <!-- Scholarships listings output -->
        <div class="max-w-4xl mx-auto">
          @if (filteredScholarships().length === 0) {
            <div class="text-center py-16 bg-slate-950/70 backdrop-blur-xl border border-dashed border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
              <mat-icon class="!w-10 !h-10 !text-[40px] text-slate-600 mb-2">youtube_searched_for</mat-icon>
              <h3 class="font-display font-bold text-white text-sm mb-1">No matches under classification</h3>
              <p class="text-[11px] text-slate-400 max-w-xs mx-auto mb-4 leading-relaxed">
                There are currently no scholarships published under the selected "{{ selectedTag() ? '#' + selectedTag() : selectedCategory() }}" criteria.
              </p>
              <button (click)="selectedCategory.set('All'); selectedTag.set(null)"
                      class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                Show All Opportunities
              </button>
            </div>
          } @else {
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              @for (item of filteredScholarships(); track item.id) {
                <app-scholarship-card 
                  [item]="item" 
                  (tagSelect)="selectedTag.set($event); selectedCategory.set('All')" />
              }
            </div>
          }
        </div>

      </main>



      <!-- Sticky footer component -->
      <app-footer />

    </div>
  `
})
export class CategoriesComponent {
  public svc = inject(ScholarshipService);
  private router = inject(Router);

  public selectedCategory = signal<string>('All');
  public selectedTag = signal<string | null>(null);

  public filteredScholarships = computed(() => {
    let list = this.svc.getPublishedScholarships();
    
    // Check Tag filtering prioritised
    const activeT = this.selectedTag();
    if (activeT) {
      return list.filter(s => s.tags.some(t => t.toLowerCase() === activeT.toLowerCase()));
    }

    // Check Category filtering
    const activeC = this.selectedCategory();
    if (activeC !== 'All') {
      return list.filter(s => s.category.toLowerCase() === activeC.toLowerCase());
    }

    return list;
  });

  public getCategoryScholarshipCount(cat: string): number {
    return this.svc.getPublishedScholarships().filter(s => s.category.toLowerCase() === cat.toLowerCase()).length;
  }

  public getTagScholarshipCount(tag: string): number {
    return this.svc.getPublishedScholarships().filter(s => s.tags.some(t => t.toLowerCase() === tag.toLowerCase())).length;
  }

  public handleAddCategory(inputEl: HTMLInputElement): void {
    const freshNewValue = inputEl.value.trim();
    if (!freshNewValue) return;
    this.svc.addCategory(freshNewValue);
    inputEl.value = '';
  }

  public handleDeleteCategory(cat: string): void {
    if (confirm(`Do you want to delete category "${cat}"? Present opportunities under it won\'t be deleted but will appear uncategorized.`)) {
      this.svc.deleteCategory(cat);
      if (this.selectedCategory() === cat) {
        this.selectedCategory.set('All');
      }
    }
  }

  public handleAddTag(inputEl: HTMLInputElement): void {
    const freshNewValue = inputEl.value.trim();
    if (!freshNewValue) return;
    this.svc.addTag(freshNewValue);
    inputEl.value = '';
  }

  public handleDeleteTag(tag: string): void {
    if (confirm(`Do you want to remove tag "#${tag}" from taxonomy index?`)) {
      this.svc.deleteTag(tag);
      if (this.selectedTag() === tag) {
        this.selectedTag.set(null);
      }
    }
  }
}
