import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Filter & Search Matrix Station — Enhanced Glassmorphism -->
    <section class="frost-heavy rounded-2xl p-5 sm:p-6 mb-8">
      
      <!-- Top row: results count + sort -->
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div class="flex items-center gap-2">
          <mat-icon class="!w-4 !h-4 !text-[16px] text-indigo-400">filter_list</mat-icon>
          <span class="text-xs font-mono text-slate-400 font-bold">
            Showing <span class="text-white">{{ resultCount }}</span> opportunities
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500 uppercase hidden sm:inline">Sort by:</span>
          <select (change)="onSortChange($event)" 
                  class="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/30 cursor-pointer backdrop-blur-sm">
            <option value="deadline">Deadline</option>
            <option value="amount">Amount</option>
            <option value="popularity">Popularity</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
      
      <div class="flex flex-col md:flex-row items-center justify-between gap-5">
        
        <!-- Horizontal Category Buttons (Glass Styled) -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none">
          @for (cat of categories; track cat) {
            <button (click)="onSelectCategory(cat)"
                    [class]="'px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-none whitespace-nowrap backdrop-blur-xl transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97] ' + 
                             (selectedCategory === cat 
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]' 
                              : 'bg-slate-950/70 text-slate-300 border-white/10 hover:bg-slate-900/80 hover:border-indigo-500/30 hover:text-white')">
              {{ cat }}
            </button>
          }
        </div>

        <!-- Smart Input Search box (Frosted glass container) -->
        <div class="search-expand relative w-full md:max-w-md flex items-center frost-light rounded-xl transition-all duration-300">
          <span class="absolute left-3.5 text-slate-400">
            <mat-icon class="!w-4 !h-4 !text-[18px]">search</mat-icon>
          </span>
          <input type="text" [value]="searchQuery" (input)="onSearchInput($event)"
                 placeholder="Search by college, nation, or keyword..."
                 class="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border-none bg-transparent text-white placeholder-slate-500 focus:outline-none font-sans transition-all" />
          
          @if (searchQuery) {
            <button (click)="clearSearch()" 
                    class="absolute right-3 text-slate-400 hover:text-white cursor-pointer focus:outline-none transition-colors">
              <mat-icon class="!w-4 !h-4 !text-[16px]">cancel</mat-icon>
            </button>
          }
        </div>

      </div>

      <!-- Scrollable Quick Popular Tag Pills -->
      <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 select-none overflow-hidden">
        <span class="text-[9px] font-mono uppercase font-bold text-slate-500 shrink-0">Quick tags:</span>
        <div class="flex items-center gap-1.5 overflow-x-auto w-full scrollbar-none py-0.5">
          @for (tag of popularTags; track tag) {
            <button (click)="onSelectTag(tag)"
                    [class]="'px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border cursor-pointer focus:outline-none whitespace-nowrap transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] ' + 
                             ((activeTag && activeTag.toLowerCase() === tag.toLowerCase()) 
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 shadow-inner' 
                              : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200 hover:border-white/10')">
              #{{ tag }}
            </button>
          }
        </div>
      </div>

      <!-- Activated filter tags indicator chips -->
      @if (activeTag) {
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          <span class="text-[9px] font-mono uppercase font-bold text-slate-500">Active tag filter:</span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/50 backdrop-blur-xl text-indigo-200 text-[10px] font-mono font-semibold border border-indigo-500/20 animate-fade-in">
            <span>#{{ activeTag }}</span>
            <button (click)="clearTag()" class="text-indigo-400 hover:text-indigo-200 cursor-pointer focus:outline-none flex items-center justify-center">
              <mat-icon class="!w-3 !h-3 !text-[12px]">close</mat-icon>
            </button>
          </span>
        </div>
      }
    </section>
  `
})
export class FilterBarComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string = 'All';
  @Input() searchQuery: string = '';
  @Input() activeTag: string | null = null;
  @Input() resultCount: number = 0;

  @Output() categoryChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() tagClear = new EventEmitter<void>();
  @Output() tagSelect = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  public popularTags = ['Fully Funded', 'STEM', 'USA', 'UK', 'Europe', 'Leadership', 'Research', 'Need-Based'];

  public onSelectCategory(cat: string): void {
    this.categoryChange.emit(cat);
  }

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChange.emit(val);
  }

  public clearSearch(): void {
    this.searchChange.emit('');
  }

  public onSelectTag(tag: string): void {
    this.tagSelect.emit(tag);
  }

  public clearTag(): void {
    this.tagClear.emit();
  }

  public onSortChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(val);
  }
}
