import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Premium Hero — Full-Width Immersive Landing Section -->
    <section class="relative mb-16 sm:mb-20 -mt-4">
      
      <!-- Deep layered background effects -->
      <div class="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div class="absolute inset-0 mesh-gradient opacity-80"></div>
        <div class="absolute -top-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-indigo-500/25 blur-[120px] pointer-events-none orb-drift-1"></div>
        <div class="absolute -bottom-20 -right-20 w-[25rem] h-[25rem] rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none orb-drift-2"></div>
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] rounded-full bg-violet-500/10 blur-[130px] pointer-events-none orb-drift-3"></div>
        <!-- Grid overlay pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40"></div>
      </div>

      <!-- Main frosted glass content panel -->
      <div class="frost-heavy rounded-3xl overflow-hidden relative">
        
        <!-- Luminous top accent line -->
        <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>
        
        <div class="px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 lg:pb-16">
          
          <!-- Top section: Badge + Headline -->
          <div class="max-w-4xl mx-auto text-center">
            
            <!-- Status badge -->
            <div class="inline-flex items-center gap-2.5 px-5 py-2 rounded-full frost-light text-[10px] font-mono font-bold tracking-wider uppercase mb-8 select-none">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span class="text-emerald-300">Live Directory</span>
              <span class="w-px h-3 bg-white/15"></span>
              <span class="text-slate-400">12,400+ Verified Opportunities</span>
            </div>
            
            <!-- Headline -->
            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.05] mb-6">
              Discover Your Path to
              <span class="block mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent pb-2">Funded Education</span>
            </h1>
            
            <!-- Sub-headline -->
            <p class="text-sm sm:text-base lg:text-lg text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto mb-10">
              Access curated, fully-funded scholarships from world-class institutions. 
              Filter by degree, field, and region — find opportunities designed for your academic ambitions.
            </p>
          </div>

          <!-- Hero Search Bar — Prominent, Glass-Layered -->
          <div class="max-w-2xl mx-auto mb-10">
            <div class="search-expand flex items-center gap-3 frost-medium rounded-2xl px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <mat-icon class="!w-5 !h-5 !text-[22px] text-indigo-400 shrink-0">search</mat-icon>
              <input type="text" 
                     placeholder="Search by university, country, or field of study..."
                     (input)="onHeroSearch($event)"
                     (keydown.enter)="onHeroSearch($event)"
                     class="w-full bg-transparent border-none outline-none text-sm sm:text-base text-white placeholder-slate-500 font-sans py-1" />
              <button (click)="scrollToResults()"
                      class="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-pointer">
                <span>Explore</span>
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">arrow_forward</mat-icon>
              </button>
            </div>
            <!-- Quick search suggestions -->
            <div class="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span class="text-[10px] font-mono text-slate-600 uppercase tracking-wide">Popular:</span>
              @for (term of quickSearchTerms; track term) {
                <button (click)="quickSearch(term)" 
                        class="text-[10px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg frost-light hover:border-indigo-500/20 transition-all cursor-pointer">
                  {{ term }}
                </button>
              }
            </div>
          </div>

          <!-- Trust Metrics Row — Icon-based, no emojis -->
          <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 max-w-3xl mx-auto">
            <div class="flex items-center gap-2 frost-light rounded-full px-4 py-2">
              <mat-icon class="!w-4 !h-4 !text-[15px] text-emerald-400">verified</mat-icon>
              <span class="text-[11px] font-semibold text-slate-300">Verified Sources</span>
            </div>
            <div class="flex items-center gap-2 frost-light rounded-full px-4 py-2">
              <mat-icon class="!w-4 !h-4 !text-[15px] text-indigo-400">public</mat-icon>
              <span class="text-[11px] font-semibold text-slate-300">150+ Countries</span>
            </div>
            <div class="flex items-center gap-2 frost-light rounded-full px-4 py-2">
              <mat-icon class="!w-4 !h-4 !text-[15px] text-amber-400">workspace_premium</mat-icon>
              <span class="text-[11px] font-semibold text-slate-300">$2.1B+ in Aid</span>
            </div>
            <div class="flex items-center gap-2 frost-light rounded-full px-4 py-2">
              <mat-icon class="!w-4 !h-4 !text-[15px] text-rose-400">schedule</mat-icon>
              <span class="text-[11px] font-semibold text-slate-300">Updated Daily</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  @Output() heroSearch = new EventEmitter<string>();

  public quickSearchTerms = ['Fully Funded', 'PhD Programs', 'USA', 'STEM', 'Europe'];

  public onHeroSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.heroSearch.emit(val);
  }

  public quickSearch(term: string): void {
    this.heroSearch.emit(term);
    this.scrollToResults();
  }

  public scrollToResults(): void {
    const el = document.getElementById('scholarship-directory-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
