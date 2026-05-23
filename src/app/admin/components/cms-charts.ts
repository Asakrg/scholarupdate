import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-cms-charts',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Scholarship Detailed Analytics Dashboard Section (Glassmorphic) -->
    <section id="scholarship-detailed-analytics" class="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Card 1: Top 5 Most Viewed Scholarships (Horizontal Bars) -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">analytics</mat-icon>
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                Most Viewed (Top 5)
              </h3>
            </div>
            <span class="text-[9px] font-mono text-slate-400 font-bold">BY VIEW COUNTS</span>
          </div>

          @if (topScholarships().length === 0) {
            <div class="py-12 text-center text-slate-400">
              <p class="text-[11px] font-sans">No scholarship data configured yet.</p>
            </div>
          } @else {
            <div class="space-y-4">
              @for (item of topScholarships(); track item.id; let idx = $index) {
                <div class="group block">
                  <div class="flex justify-between items-center mb-1 text-[11px]">
                    <span class="font-sans font-medium text-slate-200 truncate pr-2 group-hover:text-indigo-400 transition-colors" [title]="item.title">
                      {{ idx + 1 }}. {{ item.title }}
                    </span>
                    <span class="font-mono text-slate-300 font-bold whitespace-nowrap flex items-center gap-0.5">
                      <mat-icon class="!w-3 !h-3 !text-[12px] text-slate-400">visibility</mat-icon>
                      {{ item.views }}
                    </span>
                  </div>
                  <!-- Flat percentage bar, no gradients -->
                  <div class="w-full bg-slate-800/40 border border-white/5 h-2 rounded-full overflow-hidden">
                    <div class="bg-indigo-600/70 h-full rounded-full transition-all duration-500 group-hover:bg-indigo-500"
                         [style.width.%]="getBarWidth(item.views)">
                    </div>
                  </div>
                  <div class="flex justify-between items-center mt-0.5 text-[9px] font-mono text-slate-400">
                    <span>{{ item.category }} allocation</span>
                    <span>{{ item.amountDisplay }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Card 2: Strategic View Trend (Interactive SVG Line Chart) -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">trending_up</mat-icon>
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                7-Day Website Traffic
              </h3>
            </div>
            <div class="flex items-center gap-1">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              <span class="text-[9px] font-mono text-slate-400 font-bold uppercase">TREND ANALYSIS</span>
            </div>
          </div>

          <!-- Line Chart Box -->
          <div class="relative w-full h-[130px] flex items-center justify-center">
            @if (svgLinePath().points.length > 0) {
              <svg viewBox="0 0 500 130" class="w-full h-full overflow-visible select-none">
                <!-- Helper grid lines -->
                <line x1="15" y1="15" x2="485" y2="15" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="2" />
                <line x1="15" y1="65" x2="485" y2="65" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="2" />
                <line x1="15" y1="115" x2="485" y2="115" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="2" />

                <!-- Filled shade below the trend line -->
                <path [attr.d]="svgLinePath().areaPath" fill="rgba(99, 102, 241, 0.05)" class="transition-all duration-300" />
                
                <!-- Core Trend line (Solid, high-contrast, no gradient) -->
                <path [attr.d]="svgLinePath().linePath" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

                <!-- Plot circles & hover captures -->
                @for (pt of svgLinePath().points; track pt.label; let i = $index) {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="4.5" fill="#ffffff" stroke="#6366f1" stroke-width="2.5"
                          class="cursor-pointer transition-all duration-150 hover:r-[6.5]"
                          (mouseenter)="activePointIndex.set(i)"
                          (mouseleave)="activePointIndex.set(null)" />
                }
              </svg>
            } @else {
              <div class="text-center text-xs text-slate-400">Loading trend layout...</div>
            }

            <!-- Absolute Hover Tooltip inside Box -->
            @if (activePointIndex() !== null) {
              <div class="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-md flex items-center gap-1.5 border border-white/10 transition-all z-10">
                <span class="font-bold text-slate-300">{{ sevenDayTrend()[activePointIndex()!].label }}:</span>
                <span class="text-emerald-400 font-extrabold">{{ sevenDayTrend()[activePointIndex()!].views | number }} v</span>
              </div>
            }
          </div>

          <!-- Horizontal X-Axis labels -->
          <div class="flex justify-between px-2.5 mt-2 text-[9px] font-mono text-slate-400 border-t border-white/10 pt-2">
            @for (d of sevenDayTrend(); track d.label) {
              <span>{{ d.label }}</span>
            }
          </div>
        </div>
      </div>

      <!-- Card 3: Recently Viewed (Dynamic relative timestamp logs) -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">history</mat-icon>
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                Recent Activity Logs
              </h3>
            </div>
            <span class="text-[9px] font-mono text-slate-400 font-bold uppercase">LIVE UPDATE</span>
          </div>

          @if (recentlyViewed().length === 0) {
            <div class="py-12 text-center text-slate-400">
              <p class="text-[11px] font-sans">No recent access events recorded.</p>
            </div>
          } @else {
            <div class="divide-y divide-white/10">
              @for (item of recentlyViewed(); track item.id) {
                <div class="py-2.5 flex items-center justify-between gap-3 text-[11px] group">
                  <div class="min-w-0 flex-grow">
                    <span class="font-sans font-medium text-slate-200 block truncate group-hover:text-indigo-400 transition-colors">
                      {{ item.title }}
                    </span>
                    <span class="text-[9px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wide">
                      ID: {{ item.id }} • {{ item.category }}
                    </span>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="font-mono font-bold text-slate-300 block whitespace-nowrap">
                      {{ getRelativeTime(item.lastViewedAt) }}
                    </span>
                    <span class="text-[9px] font-mono font-bold text-emerald-400 uppercase flex items-center justify-end gap-0.5 mt-0.5">
                      <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                      {{ item.views }} Views
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

    </section>
  `
})
export class CmsChartsComponent {
  public svc = inject(ScholarshipService);

  public activePointIndex = signal<number | null>(null);

  public aggregateViews = computed(() => {
    return this.svc.scholarships().reduce((sum, item) => sum + item.views, 0);
  });

  public topScholarships = computed(() => {
    return [...this.svc.scholarships()]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  });

  public recentlyViewed = computed(() => {
    return [...this.svc.scholarships()]
      .filter(s => !!s.lastViewedAt)
      .sort((a, b) => {
        const tA = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
        const tB = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
        return tB - tA;
      })
      .slice(0, 5);
  });

  public sevenDayTrend = computed(() => {
    const trend = this.svc.estimatedEarnings().trend || [];
    return trend.map(t => ({
      label: t.day,
      views: t.views
    }));
  });

  public svgLinePath = computed(() => {
    const trend = this.sevenDayTrend();
    if (trend.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }
    const maxViews = Math.max(...trend.map(t => t.views), 1);
    const height = 120; // SVG canvas height
    const width = 500;
    const padding = 15;
    
    const points = trend.map((t, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (trend.length - 1);
      const scaledY = height - padding - ((t.views / maxViews) * (height - 30));
      return { x, y: scaledY, label: t.label, views: t.views };
    });
    
    const pathD = points.map((p, idx) => {
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
    
    return {
      linePath: pathD,
      areaPath: areaD,
      points: points
    };
  });

  public getBarWidth(views: number): number {
    const list = this.topScholarships();
    if (list.length === 0) return 0;
    const max = Math.max(...list.map(s => s.views), 1);
    return Math.min(100, Math.max(5, (views / max) * 100));
  }

  public getRelativeTime(isoString?: string): string {
    if (!isoString) return 'Never';
    try {
      const now = new Date().getTime();
      const past = new Date(isoString).getTime();
      const diffMs = now - past;
      
      if (diffMs < 0) return 'Just now';
      const secs = Math.floor(diffMs / 1000);
      if (secs < 60) return 'Just now';
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  }
}
