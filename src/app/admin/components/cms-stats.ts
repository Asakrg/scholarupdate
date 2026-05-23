import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../../services/scholarship';

@Component({
  selector: 'app-cms-stats',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Dynamic Stat Panels (Glassmorphic) -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-2 text-slate-400">
          <span class="text-[10px] font-mono uppercase font-bold text-slate-400">Listed Fellowships</span>
          <mat-icon class="!w-4 !h-4 !text-[20px] text-indigo-400">assignment</mat-icon>
        </div>
        <div class="text-2xl font-display font-bold text-white leading-none">
          {{ svc.scholarships().length }}
        </div>
        <p class="text-[10px] text-slate-400 font-sans mt-1.5">
          {{ svc.getPublishedScholarships().length }} published / {{ svc.scholarships().length - svc.getPublishedScholarships().length }} drafts
        </p>
      </div>

      <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-2 text-slate-400">
          <span class="text-[10px] font-mono uppercase font-bold text-slate-400">Global Website Views</span>
          <mat-icon class="!w-4 !h-4 !text-[20px] text-indigo-400">visibility</mat-icon>
        </div>
        <div class="text-2xl font-display font-bold text-white leading-none">
          {{ aggregateViews() | number }}
        </div>
        <p class="text-[10px] text-slate-400 font-sans mt-1.5">
          Total tracked website page views
        </p>
      </div>
      
      <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-2 text-slate-400">
          <span class="text-[10px] font-mono uppercase font-bold text-slate-400">Newsletter Subs</span>
          <mat-icon class="!w-4 !h-4 !text-[20px] text-indigo-400">mail</mat-icon>
        </div>
        <div class="text-2xl font-display font-bold text-white leading-none">
          {{ svc.newsletterSubscriptions().length }}
        </div>
        <p class="text-[10px] text-slate-400 font-sans mt-1.5 font-mono">
          Waitlist alerts ready to broadcast
        </p>
      </div>

      <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-2 text-slate-400">
          <span class="text-[10px] font-mono uppercase font-bold text-slate-400">AdSense Placements</span>
          <mat-icon class="!w-4 !h-4 !text-[20px] text-indigo-400">monetization_on</mat-icon>
        </div>
        <div class="text-2xl font-display font-bold text-emerald-400 leading-none flex items-center gap-1">
          Active
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p class="text-[10px] text-slate-400 font-sans mt-1.5">
          Leaderboard, Sidebar & Feed in sync
        </p>
      </div>

    </section>
  `
})
export class CmsStatsComponent {
  public svc = inject(ScholarshipService);

  public aggregateViews = computed(() => {
    return this.svc.estimatedEarnings().views || 0;
  });
}
