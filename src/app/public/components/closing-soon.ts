import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-closing-soon',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Closing Soon — Deadline Urgency Strip -->
    <section class="mb-16 sm:mb-20">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-1 flex items-center gap-2">
            <mat-icon class="!w-6 !h-6 !text-[24px] text-rose-400">alarm</mat-icon>
            Closing Soon
          </h2>
          <p class="text-sm text-slate-400 font-sans">Don't miss these deadlines</p>
        </div>
        <a routerLink="/" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
          View All <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">arrow_forward</mat-icon>
        </a>
      </div>

      <div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        @for (item of scholarships; track item.id) {
          <a [routerLink]="['/scholarship', item.id]" 
             class="min-w-[280px] max-w-[320px] snap-start frost-medium rounded-2xl p-5 flex flex-col gap-3 group hover:border-indigo-500/20 transition-all shrink-0">
            
            <!-- Countdown Badge -->
            <div [class]="'self-start px-3 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 border ' + getUrgencyClasses(getDaysLeft(item.deadline))">
              <mat-icon class="!w-3 !h-3 !text-[11px]">schedule</mat-icon>
              <span>{{ getDaysLeft(item.deadline) }} days left</span>
            </div>

            <!-- Title -->
            <h3 class="font-display font-bold text-sm text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">{{ item.title }}</h3>

            <!-- Amount -->
            <span class="font-mono text-emerald-400 text-xs font-bold">{{ item.amountDisplay }}</span>

            <!-- Category + Country -->
            <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span class="bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">{{ item.category }}</span>
              @if (item.country) {
                <span>{{ item.country }}</span>
              }
            </div>

            <!-- Urgency bar -->
            <div [class]="'urgency-bar mt-auto ' + getUrgencyBarClass(getDaysLeft(item.deadline))"></div>
          </a>
        }
      </div>
    </section>
  `
})
export class ClosingSoonComponent {
  @Input({ required: true }) scholarships: Scholarship[] = [];

  public getDaysLeft(deadline: string): number {
    return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  public getUrgencyClasses(days: number): string {
    if (days <= 7) return 'bg-rose-950/50 text-rose-400 border-rose-500/20 urgency-critical';
    if (days <= 30) return 'bg-amber-950/50 text-amber-400 border-amber-500/20';
    return 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20';
  }

  public getUrgencyBarClass(days: number): string {
    if (days <= 7) return 'urgency-danger';
    if (days <= 30) return 'urgency-warning';
    return 'urgency-safe';
  }
}
