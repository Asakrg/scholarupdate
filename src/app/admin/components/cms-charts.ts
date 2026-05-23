import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

function extractClientEmail(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    return obj.client_email || '';
  } catch {
    return '';
  }
}

function extractPrivateKey(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    return obj.private_key || '';
  } catch {
    return jsonStr.trim();
  }
}

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
                {{ isGA4Active() ? 'GA4 Active Trends' : '7-Day Website Traffic' }}
              </h3>
            </div>
            <div class="flex items-center gap-1">
              <span class="inline-block h-1.5 w-1.5 rounded-full" [class.bg-emerald-500]="isGA4Active()" [class.bg-indigo-500]="!isGA4Active()"></span>
              <span class="text-[9px] font-mono text-slate-400 font-bold uppercase">{{ isGA4Active() ? 'GA4 LIVE' : 'SIMULATION' }}</span>
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
                <path [attr.d]="svgLinePath().areaPath" [attr.fill]="isGA4Active() ? 'rgba(16, 185, 129, 0.05)' : 'rgba(99, 102, 241, 0.05)'" class="transition-all duration-300" />
                
                <!-- Core Trend line (Solid, high-contrast, no gradient) -->
                <path [attr.d]="svgLinePath().linePath" fill="none" [attr.stroke]="isGA4Active() ? '#10b981' : '#6366f1'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

                <!-- Plot circles & hover captures -->
                @for (pt of svgLinePath().points; track pt.label; let i = $index) {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="4.5" fill="#ffffff" [attr.stroke]="isGA4Active() ? '#10b981' : '#6366f1'" stroke-width="2.5"
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
                <span class="font-extrabold" [class.text-emerald-400]="isGA4Active()" [class.text-indigo-400]="!isGA4Active()">
                  {{ sevenDayTrend()[activePointIndex()!].views | number }} {{ isGA4Active() ? 'Pageviews' : 'v' }}
                </span>
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

      <!-- Card 3: Tabbed Layout: GSC Search Keywords OR Activity Logs -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <!-- Tab Headers -->
          <div class="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div class="flex gap-3">
              <button (click)="activeTab.set('keywords')"
                      [class]="'text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ' + 
                               (activeTab() === 'keywords' ? 'border-indigo-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-350')">
                GSC Keywords
              </button>
              <button (click)="activeTab.set('activity')"
                      [class]="'text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ' + 
                               (activeTab() === 'activity' ? 'border-indigo-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-350')">
                Activity Logs
              </button>
            </div>
            <span class="text-[9px] font-mono text-slate-400 font-bold uppercase">{{ activeTab() === 'keywords' ? 'GSC API' : 'LIVE VIEW' }}</span>
          </div>

          <!-- Tab Content 1: GSC Keywords -->
          @if (activeTab() === 'keywords') {
            @if (gscKeywords().length === 0) {
              <div class="py-10 text-center text-slate-400">
                <p class="text-[11px] leading-relaxed">
                  Search Console is not connected.<br/>
                  <span class="text-[9px] text-slate-500">Configure your Service Account credentials below to enable live keyword queries.</span>
                </p>
                <!-- Display Mock Keywords to show layout -->
                <div class="flex flex-wrap gap-1.5 justify-center mt-4">
                  <span class="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-slate-450">fully funded fellowships</span>
                  <span class="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-slate-450">undergrad scholarships UK</span>
                  <span class="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-slate-450">stem funding 2026</span>
                </div>
              </div>
            } @else {
              <div class="space-y-2">
                <div class="grid grid-cols-12 text-[9px] font-mono text-slate-500 font-bold border-b border-white/5 pb-1 mb-1.5 uppercase">
                  <span class="col-span-6">Keyword</span>
                  <span class="col-span-2 text-right">Clicks</span>
                  <span class="col-span-2 text-right">Imps</span>
                  <span class="col-span-2 text-right">Pos</span>
                </div>
                @for (k of gscKeywords(); track k.keyword) {
                  <div class="grid grid-cols-12 text-[11px] font-sans text-slate-300 py-1.5 hover:bg-white/[0.02] rounded-lg px-1 transition-colors">
                    <span class="col-span-6 font-mono truncate text-slate-200" [title]="k.keyword">{{ k.keyword }}</span>
                    <span class="col-span-2 text-right font-mono font-semibold text-indigo-400">{{ k.clicks }}</span>
                    <span class="col-span-2 text-right font-mono text-slate-400">{{ k.impressions }}</span>
                    <span class="col-span-2 text-right font-mono font-bold text-slate-300">{{ k.position }}</span>
                  </div>
                }
              </div>
            }
          }

          <!-- Tab Content 2: Activity Logs -->
          @if (activeTab() === 'activity') {
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
          }
        </div>
      </div>

    </section>

    <!-- Google API Integrations Settings Panel (Collapsible / Dynamic) -->
    <section class="mb-8 border border-white/10 bg-slate-950/65 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
        <div class="flex items-center gap-2">
          <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">dns</mat-icon>
          <h3 class="text-xs font-mono font-bold text-slate-250 uppercase tracking-widest">
            Google GA4 & Search Console Settings
          </h3>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider" 
              [class.bg-emerald-950]="isGoogleActive()" [class.border-emerald-800]="isGoogleActive()" [class.text-emerald-300]="isGoogleActive()"
              [class.bg-slate-900]="!isGoogleActive()" [class.border-slate-800]="!isGoogleActive()" [class.text-slate-400]="!isGoogleActive()">
          <span class="h-1.5 w-1.5 rounded-full" [class.bg-emerald-500]="isGoogleActive()" [class.bg-slate-500]="!isGoogleActive()"></span>
          <span>{{ isGoogleActive() ? 'Live Reporting Active' : 'Cache Simulation Mode' }}</span>
        </span>
      </div>

      <form (submit)="saveSettings($event, ga4MeasIdInput, ga4PropIdInput, gscVerifyInput, gscSiteUrlInput, saKeyInput)" class="space-y-4 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label class="block text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider mb-1">GA4 Measurement ID</label>
            <input type="text" #ga4MeasIdInput [value]="ga4MeasurementId()" placeholder="G-XXXXXXXXXX"
                   class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
          </div>
          <div>
            <label class="block text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider mb-1">GA4 Property ID</label>
            <input type="text" #ga4PropIdInput [value]="ga4PropertyId()" placeholder="312345678"
                   class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
          </div>
          <div>
            <label class="block text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider mb-1">GSC Verification Token</label>
            <input type="text" #gscVerifyInput [value]="gscVerificationToken()" placeholder="google-site-verification-token"
                   class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
          </div>
          <div>
            <label class="block text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider mb-1">GSC Domain/Site URL</label>
            <input type="text" #gscSiteUrlInput [value]="gscSiteUrl()" placeholder="sc-domain:ecopulse.app"
                   class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
          </div>
        </div>

        <div>
          <label class="block text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider mb-1">Google Service Account Private Key JSON</label>
          <textarea #saKeyInput rows="3" placeholder='{ "type": "service_account", "project_id": "...", "private_key": "...", ... }'
                    class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"></textarea>
          <p class="text-[9px] text-slate-500 mt-1 leading-relaxed">
            Provide the service account key JSON downloaded from Google Cloud Console. Leave empty to keep existing key.
            <span class="text-indigo-400 font-bold block mt-0.5">Authentication Security: Credentials are written securely to the local server configuration file (gitignored) and are never exposed publicly.</span>
          </p>
        </div>

        <div class="flex justify-end gap-2.5">
          <button type="submit" [disabled]="saving()"
                  class="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-all cursor-pointer select-none">
            <mat-icon class="!w-4 !h-4 !text-[15px] animate-spin" *ngIf="saving()">sync</mat-icon>
            <mat-icon class="!w-4 !h-4 !text-[15px]" *ngIf="!saving()">save</mat-icon>
            <span>{{ saving() ? 'Saving settings...' : 'Save Google Credentials' }}</span>
          </button>
        </div>
      </form>
    </section>
  `
})
export class CmsChartsComponent implements OnInit {
  public svc = inject(ScholarshipService);

  public activePointIndex = signal<number | null>(null);
  public activeTab = signal<'keywords' | 'activity'>('keywords');

  // Integrations settings signals
  public ga4MeasurementId = signal<string>('');
  public ga4PropertyId = signal<string>('');
  public gscVerificationToken = signal<string>('');
  public gscSiteUrl = signal<string>('');
  public saving = signal<boolean>(false);

  // Live reporting metrics signals
  public ga4Data = signal<any>(null);
  public gscData = signal<any>(null);

  public isGA4Active = computed(() => {
    const data = this.ga4Data();
    return !!(data && data.configured);
  });

  public isGoogleActive = computed(() => {
    return this.isGA4Active() || !!(this.gscData() && this.gscData().configured);
  });

  public gscKeywords = computed(() => {
    const data = this.gscData();
    if (data && data.configured && data.keywords) {
      return data.keywords;
    }
    return [];
  });

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
    const ga4 = this.ga4Data();
    if (ga4 && ga4.configured && ga4.trend && ga4.trend.length > 0) {
      return ga4.trend.map((t: any) => ({
        label: t.day,
        views: t.views
      }));
    }

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
    const maxViews = Math.max(...trend.map((t: any) => t.views), 1);
    const height = 120;
    const width = 500;
    const padding = 15;
    
    const points = trend.map((t: any, idx: number) => {
      const x = padding + (idx * (width - 2 * padding)) / (trend.length - 1);
      const scaledY = height - padding - ((t.views / maxViews) * (height - 30));
      return { x, y: scaledY, label: t.label, views: t.views };
    });
    
    const pathD = points.map((p: any, idx: number) => {
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
    
    return {
      linePath: pathD,
      areaPath: areaD,
      points: points
    };
  });

  public ngOnInit(): void {
    this.loadSettings();
    this.loadAnalytics();
  }

  public async loadSettings(): Promise<void> {
    try {
      const data = await this.svc.getIntegrationsSettings();
      this.ga4MeasurementId.set(data.ga4MeasurementId || '');
      this.ga4PropertyId.set(data.ga4PropertyId || '');
      this.gscVerificationToken.set(data.googleSiteVerification || '');
      this.gscSiteUrl.set(data.gscSiteUrl || '');
    } catch (e) {
      console.warn('Failed to load integrations settings', e);
    }
  }

  public async loadAnalytics(): Promise<void> {
    try {
      const ga4 = await this.svc.getGA4ReportingData();
      this.ga4Data.set(ga4);
    } catch (e) { }

    try {
      const gsc = await this.svc.getGSCReportingData();
      this.gscData.set(gsc);
    } catch (e) { }
  }

  public async saveSettings(
    event: Event, 
    measId: HTMLInputElement, 
    propId: HTMLInputElement, 
    verifyToken: HTMLInputElement, 
    siteUrl: HTMLInputElement, 
    privateKey: HTMLTextAreaElement
  ): Promise<void> {
    event.preventDefault();
    this.saving.set(true);

    const clientEmail = privateKey.value ? extractClientEmail(privateKey.value) : '';
    const formattedPrivateKey = privateKey.value ? extractPrivateKey(privateKey.value) : '';

    const payload: any = {
      ga4MeasurementId: measId.value.trim(),
      ga4PropertyId: propId.value.trim(),
      googleSiteVerification: verifyToken.value.trim(),
      gscSiteUrl: siteUrl.value.trim()
    };

    if (privateKey.value) {
      payload.clientEmail = clientEmail;
      payload.privateKey = formattedPrivateKey;
    }

    try {
      await this.svc.saveIntegrationsSettings(payload);
      this.svc.showToast('success', 'Credentials Saved', 'Successfully updated Google GA4 and Search Console settings.');
      privateKey.value = '';
      await this.loadSettings();
      await this.loadAnalytics();
    } catch (err) {
      this.svc.showToast('error', 'Update Failed', err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      this.saving.set(false);
    }
  }

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
