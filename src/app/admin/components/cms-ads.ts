import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, AdProvider, AdEarningsData } from '../../services/scholarship';

@Component({
  selector: 'app-cms-ads',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      
      <!-- Part 1: Earnings Statistics Summary -->
      <section id="ad-earnings-stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        
        <!-- Today's Estimated Earnings -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Today's Earnings</span>
            <span class="text-xl font-display font-semibold text-emerald-400 block font-mono">
              \${{ svc.estimatedEarnings().today | number:'1.2-2' }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">monetization_on</mat-icon>
          </div>
        </div>

        <!-- Yesterday's Earnings -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Yesterday</span>
            <span class="text-xl font-display font-semibold text-slate-200 block font-mono">
              \${{ svc.estimatedEarnings().yesterday | number:'1.2-2' }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">history</mat-icon>
          </div>
        </div>

        <!-- Monthly Estimated Earnings -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">This Month (Est)</span>
            <span class="text-xl font-display font-semibold text-indigo-400 block font-mono">
              \${{ svc.estimatedEarnings().month | number:'1.2-2' }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-950/45 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">calendar_month</mat-icon>
          </div>
        </div>

        <!-- Impressions Count -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Ad Impressions</span>
            <span class="text-xl font-display font-semibold text-slate-200 block font-mono">
              {{ svc.estimatedEarnings().impressions | number }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">visibility</mat-icon>
          </div>
        </div>

        <!-- Ad Clicks Count -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Ad Clicks</span>
            <span class="text-xl font-display font-semibold text-amber-400 block font-mono">
              {{ svc.estimatedEarnings().clicks | number }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">ads_click</mat-icon>
          </div>
        </div>

        <!-- Website Views Count -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Website Views</span>
            <span class="text-xl font-display font-semibold text-sky-400 block font-mono">
              {{ svc.estimatedEarnings().views | number }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-500/20 flex items-center justify-center text-sky-450">
            <mat-icon class="!w-5 !h-5 !text-[20px]">trending_up</mat-icon>
          </div>
        </div>

        <!-- Average eCPM -->
        <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between transition-all hover:border-white/15">
          <div class="space-y-1">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Average eCPM</span>
            <span class="text-xl font-display font-semibold text-purple-400 block font-mono">
              \${{ svc.estimatedEarnings().ecpm | number:'1.2-2' }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <mat-icon class="!w-5 !h-5 !text-[20px]">query_stats</mat-icon>
          </div>
        </div>

      </section>

      <!-- Part 2: Double-Column Provider Controls & Earnings Trend Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Provider Cards (Toggles) (2 Cols) -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-2 border-b border-white/10 pb-3 mb-2 select-none">
            <mat-icon class="!w-4 !h-4 !text-[16px] text-indigo-400">tune</mat-icon>
            <h2 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">Ad Network Configurations</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (prov of svc.adProviders(); track prov.id) {
              <div class="border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-150"
                   [ngClass]="{
                     'border-indigo-500/40 bg-slate-900/60 shadow-indigo-500/5': prov.enabled,
                     'border-white/10 bg-slate-950/40 hover:bg-slate-950/60': !prov.enabled
                   }">
                <div>
                  
                  <!-- Card Header: Title & Switch -->
                  <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div class="space-y-0.5">
                      <h3 class="font-display font-bold text-sm text-slate-100">{{ prov.name }}</h3>
                      <span class="text-[9px] font-mono font-bold text-indigo-400" *ngIf="prov.enabled">ACTIVE PROVIDER</span>
                      <span class="text-[9px] font-mono text-slate-500" *ngIf="!prov.enabled">INACTIVE</span>
                    </div>
                    
                    <button type="button" (click)="toggleProvider(prov.id, !prov.enabled)"
                            [class]="'relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ' + 
                                     (prov.enabled ? 'bg-indigo-600' : 'bg-slate-800 border border-white/10')">
                      <span [class]="'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ' + 
                                     (prov.enabled ? 'translate-x-4.5' : 'translate-x-0.5')"></span>
                    </button>
                  </div>


                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right: Trend Chart (1 Col) -->
        <div class="lg:col-span-1">
          <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-full">
            <div>
              <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4 select-none">
                <div class="flex items-center gap-2">
                  <mat-icon class="!w-4 !h-4 !text-[16px] text-indigo-400">analytics</mat-icon>
                  <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">7-Day Earnings Line</h3>
                </div>
                <span class="text-[9px] font-mono text-slate-500 font-bold uppercase">TREND REPORT</span>
              </div>

              <!-- Trend chart container box -->
              <div class="relative w-full h-[150px] flex items-center justify-center">
                @if (svgAdsPath().points.length > 0) {
                  <svg viewBox="0 0 500 150" class="w-full h-full overflow-visible select-none">
                    <!-- Grid Lines -->
                    <line x1="20" y1="15" x2="480" y2="15" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="2" />
                    <line x1="20" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="2" />
                    <line x1="20" y1="135" x2="480" y2="135" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="2" />

                    <!-- Fill under area -->
                    <path [attr.d]="svgAdsPath().areaPath" fill="rgba(16, 185, 129, 0.05)" class="transition-all duration-300" />

                    <!-- Core trend line -->
                    <path [attr.d]="svgAdsPath().linePath" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

                    <!-- Data dots -->
                    @for (pt of svgAdsPath().points; track pt.label; let i = $index) {
                      <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="4.5" fill="#ffffff" stroke="#10b981" stroke-width="2.5"
                              class="cursor-pointer transition-all duration-150 hover:r-[6.5]"
                              (mouseenter)="hoveredPointIndex.set(i)"
                              (mouseleave)="hoveredPointIndex.set(null)" />
                    }
                  </svg>

                  <!-- Dynamic hover tooltip details display inside container -->
                  <div class="absolute bottom-1 right-2 bg-slate-900 border border-white/10 rounded-lg p-2 text-right text-[10px] font-mono min-w-[100px] shadow-lg pointer-events-none select-none z-10">
                    @if (hoveredPointIndex() !== null) {
                      <span class="text-slate-400 block uppercase text-[8px]">{{ svgAdsPath().points[hoveredPointIndex()!].label }} Day</span>
                      <strong class="text-emerald-400 font-semibold">\${{ svgAdsPath().points[hoveredPointIndex()!].val | number:'1.2-2' }}</strong>
                    } @else {
                      <span class="text-slate-500 block uppercase text-[8px]">Daily Average</span>
                      <strong class="text-slate-300 font-semibold">\${{ getDailyAverage() | number:'1.2-2' }}</strong>
                    }
                  </div>
                } @else {
                  <div class="text-slate-500 italic text-[11px]">No earnings trend records configured.</div>
                }
              </div>

              <!-- X-Axis Labels row -->
              <div class="flex justify-between items-center px-4 mt-2 select-none border-t border-white/5 pt-2 text-[9px] font-mono text-slate-500">
                @for (pt of svgAdsPath().points; track pt.label) {
                  <span>{{ pt.label }}</span>
                }
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CmsAdsComponent {
  public svc = inject(ScholarshipService);
  public hoveredPointIndex = signal<number | null>(null);

  // SVG Trend Line Calculator
  public svgAdsPath = computed(() => {
    const trend = this.svc.estimatedEarnings().trend || [];
    if (trend.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }
    const maxVal = Math.max(...trend.map(d => d.earnings)) * 1.15 || 100;
    const minVal = Math.min(...trend.map(d => d.earnings)) * 0.85 || 0;
    const range = maxVal - minVal;
    
    const width = 450;
    const height = 110;
    const paddingLeft = 25;
    const paddingTop = 15;
    
    const points = trend.map((pt, idx) => {
      const x = paddingLeft + (idx * (width / (trend.length - 1)));
      const pct = range > 0 ? (pt.earnings - minVal) / range : 0.5;
      const y = paddingTop + (height - (pct * height));
      return { x, y, label: pt.day, val: pt.earnings };
    });
    
    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + height} L ${points[0].x} ${paddingTop + height} Z`
      : '';
      
    return { linePath, areaPath, points };
  });

  // Toggle active ad provider
  public toggleProvider(providerId: string, enabled: boolean): void {
    this.svc.updateAdProviderSettings(providerId, { enabled });
  }



  // Helper metrics calculator
  public getDailyAverage(): number {
    const trend = this.svc.estimatedEarnings().trend || [];
    if (trend.length === 0) return 0;
    const total = trend.reduce((sum, item) => sum + item.earnings, 0);
    return total / trend.length;
  }
}
