import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface CategoryItem {
  icon: string;
  label: string;
  value: string;
  color: string; // accent color class
  count?: number;
}

interface CategoryGroup {
  title: string;
  icon: string;
  items: CategoryItem[];
}

@Component({
  selector: 'app-categories-grid',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Browse by Category — Premium Card Grid Design -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-10">
        <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2 block">Explore Opportunities</span>
        <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-2">Browse by Category</h2>
        <p class="text-sm text-slate-400 font-sans max-w-lg mx-auto">Find scholarships tailored to your degree level, field of study, funding type, or geographic region</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (group of groups; track group.title) {
          <div class="frost-medium rounded-2xl p-6 relative overflow-hidden group/card hover:border-indigo-500/15 transition-all">
            <!-- Subtle glow accent per group -->
            <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-[40px] pointer-events-none"
                 [class]="group === groups[0] ? 'bg-indigo-500' : group === groups[1] ? 'bg-emerald-500' : group === groups[2] ? 'bg-amber-500' : 'bg-cyan-500'"></div>
            
            <!-- Group header -->
            <div class="flex items-center gap-2.5 mb-5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center border"
                   [class]="group === groups[0] ? 'bg-indigo-500/10 border-indigo-500/20' : group === groups[1] ? 'bg-emerald-500/10 border-emerald-500/20' : group === groups[2] ? 'bg-amber-500/10 border-amber-500/20' : 'bg-cyan-500/10 border-cyan-500/20'">
                <mat-icon class="!w-5 !h-5 !text-[18px]"
                          [class]="group === groups[0] ? 'text-indigo-400' : group === groups[1] ? 'text-emerald-400' : group === groups[2] ? 'text-amber-400' : 'text-cyan-400'">
                  {{ group.icon }}
                </mat-icon>
              </div>
              <div>
                <h3 class="font-display font-bold text-sm text-white">{{ group.title }}</h3>
                <span class="text-[10px] font-mono text-slate-500">{{ group.items.length }} categories</span>
              </div>
            </div>

            <!-- Category chips grid -->
            <div class="grid grid-cols-2 gap-2">
              @for (item of group.items; track item.value) {
                <button (click)="onCategorySelect(item.value)"
                        [class]="'category-chip flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer focus:outline-none text-left w-full ' +
                                 (selectedCategory === item.value 
                                  ? 'bg-indigo-600/20 border-indigo-500/30 text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                                  : 'frost-light text-slate-300 hover:text-white')">
                  <mat-icon [class]="'!w-4 !h-4 !text-[16px] shrink-0 ' + item.color">{{ item.icon }}</mat-icon>
                  <span class="text-xs font-semibold truncate">{{ item.label }}</span>
                </button>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class CategoriesGridComponent {
  @Input() selectedCategory: string = '';
  @Output() categorySelect = new EventEmitter<string>();

  public groups: CategoryGroup[] = [
    {
      title: 'By Degree Level',
      icon: 'school',
      items: [
        { icon: 'school', label: 'Undergraduate', value: 'Undergrad', color: 'text-indigo-400' },
        { icon: 'psychology', label: "Master's", value: 'Postgrad', color: 'text-indigo-400' },
        { icon: 'science', label: 'PhD & Doctoral', value: 'PhD', color: 'text-indigo-400' },
        { icon: 'biotech', label: 'Postdoctoral', value: 'Postdoc', color: 'text-indigo-400' }
      ]
    },
    {
      title: 'By Funding Type',
      icon: 'payments',
      items: [
        { icon: 'verified', label: 'Fully Funded', value: 'Fully-Funded', color: 'text-emerald-400' },
        { icon: 'savings', label: 'Partial Funding', value: 'Partial', color: 'text-emerald-400' },
        { icon: 'account_balance', label: 'Tuition Waiver', value: 'Tuition-Waiver', color: 'text-emerald-400' },
        { icon: 'wallet', label: 'Living Stipend', value: 'Stipend', color: 'text-emerald-400' }
      ]
    },
    {
      title: 'By Field of Study',
      icon: 'auto_stories',
      items: [
        { icon: 'biotech', label: 'STEM', value: 'STEM', color: 'text-amber-400' },
        { icon: 'palette', label: 'Arts & Humanities', value: 'Arts', color: 'text-amber-400' },
        { icon: 'business', label: 'Business & MBA', value: 'Business', color: 'text-amber-400' },
        { icon: 'medical_services', label: 'Medicine', value: 'Medicine', color: 'text-amber-400' },
        { icon: 'gavel', label: 'Law', value: 'Law', color: 'text-amber-400' },
        { icon: 'groups', label: 'Social Sciences', value: 'Social-Sciences', color: 'text-amber-400' }
      ]
    },
    {
      title: 'By Region',
      icon: 'public',
      items: [
        { icon: 'flag', label: 'United States', value: 'USA', color: 'text-cyan-400' },
        { icon: 'flag', label: 'United Kingdom', value: 'UK', color: 'text-cyan-400' },
        { icon: 'flag', label: 'Europe', value: 'Europe', color: 'text-cyan-400' },
        { icon: 'public', label: 'Africa', value: 'Africa', color: 'text-cyan-400' },
        { icon: 'public', label: 'Asia Pacific', value: 'Asia', color: 'text-cyan-400' },
        { icon: 'language', label: 'Global', value: 'Global', color: 'text-cyan-400' }
      ]
    }
  ];

  public onCategorySelect(value: string): void {
    this.categorySelect.emit(value);
  }
}
