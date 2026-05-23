import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-how-it-works',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- How It Works — Three-Step Flow -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-10">
        <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-2">How ScholarshipHub Works</h2>
        <p class="text-sm text-slate-400 font-sans">Three simple steps to your fully-funded future</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        <!-- Connector line on desktop -->
        <div class="hidden md:block absolute top-[4.5rem] left-[20%] right-[20%] h-[1px] border-t border-dashed border-white/10 z-0"></div>

        <!-- Step 1 -->
        <div class="frost-medium rounded-2xl p-8 text-center relative z-10">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-sm mb-4">1</div>
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mx-auto mb-4">
            <mat-icon class="!w-7 !h-7 !text-[28px] text-indigo-400">search</mat-icon>
          </div>
          <h3 class="font-display font-bold text-lg text-white mb-2">Discover Opportunities</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Filter by country, field of study, degree level, or funding type to find scholarships tailored to your academic profile.</p>
        </div>

        <!-- Step 2 -->
        <div class="frost-medium rounded-2xl p-8 text-center relative z-10">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-sm mb-4">2</div>
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-4">
            <mat-icon class="!w-7 !h-7 !text-[28px] text-emerald-400">bookmark_border</mat-icon>
          </div>
          <h3 class="font-display font-bold text-lg text-white mb-2">Shortlist & Compare</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Save your top matches, compare funding packages side-by-side, and track application deadlines in one place.</p>
        </div>

        <!-- Step 3 -->
        <div class="frost-medium rounded-2xl p-8 text-center relative z-10">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-sm mb-4">3</div>
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto mb-4">
            <mat-icon class="!w-7 !h-7 !text-[28px] text-amber-400">rocket_launch</mat-icon>
          </div>
          <h3 class="font-display font-bold text-lg text-white mb-2">Apply with Confidence</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Get direct links to official applications, insider tips, and deadline reminders so you never miss an opportunity.</p>
        </div>

      </div>
    </section>
  `
})
export class HowItWorksComponent {}
