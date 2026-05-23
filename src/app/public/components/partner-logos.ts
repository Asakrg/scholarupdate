import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-partner-logos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Partner Universities Marquee — Infinite Animated Scroll -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-6">
        <h2 class="font-display font-bold text-lg sm:text-xl text-white mb-1">Trusted by Leading Institutions</h2>
        <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Partnering with the world's top universities</p>
      </div>

      <div class="frost-medium rounded-2xl py-8 overflow-hidden relative">
        <!-- Fade edges for seamless feel -->
        <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950/90 via-slate-950/60 to-transparent z-10 pointer-events-none"></div>
        
        <!-- First row - scrolling left -->
        <div class="marquee-track items-center mb-5" style="animation-duration: 35s;">
          @for (logo of row1Logos; track $index) {
            <div class="flex items-center gap-2 shrink-0 px-5 py-2 rounded-xl frost-light hover:border-indigo-500/20 transition-all group cursor-default">
              <span class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-display font-black text-sm group-hover:bg-indigo-500/20 transition-all">
                {{ logo.charAt(0) }}
              </span>
              <span class="text-slate-400 font-display font-bold text-sm tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
                {{ logo }}
              </span>
            </div>
          }
        </div>

        <!-- Second row - scrolling right (reversed) -->
        <div class="marquee-track items-center" style="animation-duration: 40s; animation-direction: reverse;">
          @for (logo of row2Logos; track $index) {
            <div class="flex items-center gap-2 shrink-0 px-5 py-2 rounded-xl frost-light hover:border-emerald-500/20 transition-all group cursor-default">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-display font-black text-sm group-hover:bg-emerald-500/20 transition-all">
                {{ logo.charAt(0) }}
              </span>
              <span class="text-slate-400 font-display font-bold text-sm tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
                {{ logo }}
              </span>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class PartnerLogosComponent {
  private row1 = [
    'Oxford University', 'Stanford University', 'MIT', 'Cambridge University',
    'Harvard University', 'Yale University', 'Princeton University', 'Columbia University',
    'ETH Zurich', 'University of Tokyo', 'NUS Singapore', 'University of Melbourne'
  ];
  private row2 = [
    'Caltech', 'Imperial College London', 'University of Toronto', 'Peking University',
    'Sorbonne University', 'TU Munich', 'Seoul National University', 'McGill University',
    'UC Berkeley', 'London School of Economics', 'EPFL', 'University of Cape Town'
  ];

  // Duplicate for seamless infinite scroll
  public row1Logos = [...this.row1, ...this.row1];
  public row2Logos = [...this.row2, ...this.row2];
}
