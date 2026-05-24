import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PartnerUniversity {
  name: string;
  domain: string;
  logo: string;
}

@Component({
  selector: 'app-partner-logos',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Partner Universities Marquee — Infinite Animated Scroll -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-6 select-none">
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
            <div class="flex items-center gap-2.5 shrink-0 px-5 py-2 rounded-xl frost-light hover:border-indigo-500/25 transition-all group cursor-default shadow-sm hover:shadow-indigo-500/5">
              <div class="w-8 h-8 rounded-lg bg-white/95 border border-white/20 flex items-center justify-center p-1 group-hover:bg-white group-hover:scale-105 transition-all shadow-md">
                <img [src]="logo.logo" [alt]="logo.name" class="w-full h-full object-contain rounded" referrerpolicy="no-referrer" />
              </div>
              <span class="text-slate-400 font-display font-bold text-sm tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
                {{ logo.name }}
              </span>
            </div>
          }
        </div>

        <!-- Second row - scrolling right (reversed) -->
        <div class="marquee-track items-center" style="animation-duration: 40s; animation-direction: reverse;">
          @for (logo of row2Logos; track $index) {
            <div class="flex items-center gap-2.5 shrink-0 px-5 py-2 rounded-xl frost-light hover:border-emerald-500/25 transition-all group cursor-default shadow-sm hover:shadow-emerald-500/5">
              <div class="w-8 h-8 rounded-lg bg-white/95 border border-white/20 flex items-center justify-center p-1 group-hover:bg-white group-hover:scale-105 transition-all shadow-md">
                <img [src]="logo.logo" [alt]="logo.name" class="w-full h-full object-contain rounded" referrerpolicy="no-referrer" />
              </div>
              <span class="text-slate-400 font-display font-bold text-sm tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
                {{ logo.name }}
              </span>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class PartnerLogosComponent {
  private row1: PartnerUniversity[] = [
    { name: 'Oxford University', domain: 'ox.ac.uk', logo: 'https://logo.clearbit.com/ox.ac.uk' },
    { name: 'Stanford University', domain: 'stanford.edu', logo: 'https://logo.clearbit.com/stanford.edu' },
    { name: 'MIT', domain: 'mit.edu', logo: 'https://logo.clearbit.com/mit.edu' },
    { name: 'Cambridge University', domain: 'cam.ac.uk', logo: 'https://logo.clearbit.com/cam.ac.uk' },
    { name: 'Harvard University', domain: 'harvard.edu', logo: 'https://logo.clearbit.com/harvard.edu' },
    { name: 'Yale University', domain: 'yale.edu', logo: 'https://logo.clearbit.com/yale.edu' },
    { name: 'Princeton University', domain: 'princeton.edu', logo: 'https://logo.clearbit.com/princeton.edu' },
    { name: 'Columbia University', domain: 'columbia.edu', logo: 'https://logo.clearbit.com/columbia.edu' },
    { name: 'ETH Zurich', domain: 'ethz.ch', logo: 'https://logo.clearbit.com/ethz.ch' },
    { name: 'University of Tokyo', domain: 'u-tokyo.ac.jp', logo: 'https://logo.clearbit.com/u-tokyo.ac.jp' },
    { name: 'NUS Singapore', domain: 'nus.edu.sg', logo: 'https://logo.clearbit.com/nus.edu.sg' },
    { name: 'University of Melbourne', domain: 'unimelb.edu.au', logo: 'https://logo.clearbit.com/unimelb.edu.au' }
  ];

  private row2: PartnerUniversity[] = [
    { name: 'Caltech', domain: 'caltech.edu', logo: 'https://logo.clearbit.com/caltech.edu' },
    { name: 'Imperial College London', domain: 'imperial.ac.uk', logo: 'https://logo.clearbit.com/imperial.ac.uk' },
    { name: 'University of Toronto', domain: 'utoronto.ca', logo: 'https://logo.clearbit.com/utoronto.ca' },
    { name: 'Peking University', domain: 'pku.edu.cn', logo: 'https://logo.clearbit.com/pku.edu.cn' },
    { name: 'Sorbonne University', domain: 'sorbonne-universite.fr', logo: 'https://logo.clearbit.com/sorbonne-universite.fr' },
    { name: 'TU Munich', domain: 'tum.de', logo: 'https://logo.clearbit.com/tum.de' },
    { name: 'Seoul National University', domain: 'snu.ac.kr', logo: 'https://logo.clearbit.com/snu.ac.kr' },
    { name: 'McGill University', domain: 'mcgill.ca', logo: 'https://logo.clearbit.com/mcgill.ca' },
    { name: 'UC Berkeley', domain: 'berkeley.edu', logo: 'https://logo.clearbit.com/berkeley.edu' },
    { name: 'London School of Economics', domain: 'lse.ac.uk', logo: 'https://logo.clearbit.com/lse.ac.uk' },
    { name: 'EPFL', domain: 'epfl.ch', logo: 'https://logo.clearbit.com/epfl.ch' },
    { name: 'University of Cape Town', domain: 'uct.ac.za', logo: 'https://logo.clearbit.com/uct.ac.za' }
  ];

  // Duplicate for seamless infinite scroll
  public row1Logos = [...this.row1, ...this.row1];
  public row2Logos = [...this.row2, ...this.row2];
}
