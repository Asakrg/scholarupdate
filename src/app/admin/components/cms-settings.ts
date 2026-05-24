import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../../services/scholarship';
import { CmsUsersSubsComponent } from './cms-users-subs';

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
  selector: 'app-cms-settings',
  imports: [CommonModule, MatIconModule, CmsUsersSubsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      
      <!-- Settings Tab Selector Header -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button (click)="activeSettingsTab.set('google')"
                  [class]="'px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (activeSettingsTab() === 'google' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Google Analytics & GSC
          </button>
          <button (click)="activeSettingsTab.set('ads')"
                  [class]="'px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (activeSettingsTab() === 'ads' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Ad Networks Config
          </button>
          <button (click)="activeSettingsTab.set('users')"
                  [class]="'px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (activeSettingsTab() === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Access & Security Users
          </button>
        </div>
        <span class="text-[9px] font-mono text-slate-450 uppercase tracking-widest font-bold hidden sm:inline">CONTROL TERMINAL</span>
      </div>

      <!-- Tab 1: Google Integrations (GA4 & Search Console) -->
      @if (activeSettingsTab() === 'google') {
        <section class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 select-none">
            <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">dns</mat-icon>
            <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Google APIs & Analytics Integrations
            </h3>
          </div>

          <form (submit)="saveGoogleSettings($event, ga4MeasIdInput, ga4PropIdInput, gscVerifyInput, gscSiteUrlInput, saKeyInput, geminiApiKeyInput)" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">GA4 Measurement ID</label>
                <input type="text" #ga4MeasIdInput [value]="ga4MeasurementId()" placeholder="G-XXXXXXXXXX"
                       class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
              <div>
                <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">GA4 Property ID</label>
                <input type="text" #ga4PropIdInput [value]="ga4PropertyId()" placeholder="312345678"
                       class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
              <div>
                <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">GSC Verification Token</label>
                <input type="text" #gscVerifyInput [value]="gscVerificationToken()" placeholder="google-site-verification-token"
                       class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
              <div>
                <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">GSC Domain/Site URL</label>
                <input type="text" #gscSiteUrlInput [value]="gscSiteUrl()" placeholder="sc-domain:ecopulse.app"
                       class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
            </div>

            <div class="border-t border-white/5 pt-4">
              <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Google Gemini Developer API Key</label>
              <input type="password" #geminiApiKeyInput [value]="geminiApiKey()" placeholder="AIzaSy..."
                     class="w-full px-3 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Provide your Gemini Flash developer API key. This key is used in the scholarship editor overlay to automatically clean, correct grammar, and format scraped descriptions using artificial intelligence.
              </p>
            </div>

            <div>
              <label class="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Google Service Account Private Key JSON</label>
              <textarea #saKeyInput rows="4" placeholder='{ "type": "service_account", "project_id": "...", "private_key": "...", ... }'
                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"></textarea>
              <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Provide the service account key JSON downloaded from Google Cloud Console. Leave empty to keep the existing key.
                <span class="text-indigo-400 font-bold block mt-0.5">Authentication Security: Credentials are written securely on the server-side configuration file (gitignored) and are never exposed publicly.</span>
              </p>
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" [disabled]="savingGoogle()"
                      class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer select-none">
                <mat-icon class="!w-4 !h-4 !text-[15px] animate-spin" *ngIf="savingGoogle()">sync</mat-icon>
                <mat-icon class="!w-4 !h-4 !text-[15px]" *ngIf="!savingGoogle()">save</mat-icon>
                <span>{{ savingGoogle() ? 'Saving settings...' : 'Save Google Credentials' }}</span>
              </button>
            </div>
          </form>
        </section>
      }

      <!-- Tab 2: Ad Network Credentials Configurations -->
      @if (activeSettingsTab() === 'ads') {
        <section class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 select-none">
            <mat-icon class="!w-4 !h-4 !text-[18px] text-indigo-400">tune</mat-icon>
            <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Ad Network Credentials & Script Toggles
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (prov of svc.adProviders(); track prov.id) {
              <div class="border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300"
                   [ngClass]="{
                     'border-indigo-500/40 bg-slate-900/40 shadow-indigo-500/5': prov.enabled,
                     'border-white/10 bg-slate-950/40': !prov.enabled
                   }">
                <div>
                  <!-- Card Header: Title & Switch -->
                  <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
                    <div class="space-y-0.5">
                      <h4 class="font-display font-bold text-sm text-slate-100">{{ prov.name }}</h4>
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

                  <!-- Placements Config -->
                  <div class="space-y-2.5 mb-4" [ngClass]="{'opacity-100': prov.enabled, 'opacity-45 pointer-events-none select-none': !prov.enabled}">
                    <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Placements</span>
                    
                    <div class="flex items-center justify-between text-xs py-1">
                      <span class="text-slate-300">Leaderboard Banner (Public top)</span>
                      <input type="checkbox" [checked]="prov.placements.leaderboard" 
                             (change)="togglePlacement(prov.id, 'leaderboard', $any($event.target).checked)"
                             class="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer h-4 w-4" />
                    </div>

                    <div class="flex items-center justify-between text-xs py-1">
                      <span class="text-slate-300">Sidebar Slot (Details page)</span>
                      <input type="checkbox" [checked]="prov.placements.sidebar" 
                             (change)="togglePlacement(prov.id, 'sidebar', $any($event.target).checked)"
                             class="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer h-4 w-4" />
                    </div>

                    <div class="flex items-center justify-between text-xs py-1">
                      <span class="text-slate-300">In-Feed Grid Slot (Homepage)</span>
                      <input type="checkbox" [checked]="prov.placements.inFeed" 
                             (change)="togglePlacement(prov.id, 'inFeed', $any($event.target).checked)"
                             class="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer h-4 w-4" />
                    </div>
                  </div>

                  <!-- Credentials Fields -->
                  <div class="space-y-3 pt-3 border-t border-white/5">
                    <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Network Credentials</span>
                    
                    @if (prov.id === 'adsense') {
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Publisher ID (ca-pub-*)</label>
                          <input type="text" [value]="prov.credentials?.publisherId || ''" 
                                 (input)="updateCredential(prov.id, 'publisherId', $any($event.target).value)"
                                 placeholder="ca-pub-123456789"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Ad Slot ID</label>
                          <input type="text" [value]="prov.credentials?.slotId || ''" 
                                 (input)="updateCredential(prov.id, 'slotId', $any($event.target).value)"
                                 placeholder="9876543210"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                      </div>
                    }

                    @if (prov.id === 'ezoic') {
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Publisher ID</label>
                          <input type="text" [value]="prov.credentials?.publisherId || ''" 
                                 (input)="updateCredential(prov.id, 'publisherId', $any($event.target).value)"
                                 placeholder="12345"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Site ID</label>
                          <input type="text" [value]="prov.credentials?.siteId || ''" 
                                 (input)="updateCredential(prov.id, 'siteId', $any($event.target).value)"
                                 placeholder="54321"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                      </div>
                    }

                    @if (prov.id === 'mediavine') {
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Account ID (mv-xxxx)</label>
                          <input type="text" [value]="prov.credentials?.publisherId || ''" 
                                 (input)="updateCredential(prov.id, 'publisherId', $any($event.target).value)"
                                 placeholder="mv-1029"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Site ID</label>
                          <input type="text" [value]="prov.credentials?.siteId || ''" 
                                 (input)="updateCredential(prov.id, 'siteId', $any($event.target).value)"
                                 placeholder="my-awesome-site"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                      </div>
                    }

                    @if (prov.id === 'adsterra') {
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Publisher ID / User</label>
                          <input type="text" [value]="prov.credentials?.publisherId || ''" 
                                 (input)="updateCredential(prov.id, 'publisherId', $any($event.target).value)"
                                 placeholder="adsterra_user"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="text-[9px] text-slate-400 font-mono">Banner / Placement ID</label>
                          <input type="text" [value]="prov.credentials?.bannerId || ''" 
                                 (input)="updateCredential(prov.id, 'bannerId', $any($event.target).value)"
                                 placeholder="banner_300x250_abc"
                                 class="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/50 focus:outline-none" />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Tab 3: Users Whitelist and Access Controls (Uses the pre-existing, fully functional component) -->
      @if (activeSettingsTab() === 'users') {
        <app-cms-users-subs />
      }
    </div>
  `
})
export class CmsSettingsComponent implements OnInit {
  public svc = inject(ScholarshipService);

  public activeSettingsTab = signal<'google' | 'ads' | 'users'>('google');

  // Google settings states
  public ga4MeasurementId = signal<string>('');
  public ga4PropertyId = signal<string>('');
  public gscVerificationToken = signal<string>('');
  public gscSiteUrl = signal<string>('');
  public geminiApiKey = signal<string>('');
  public savingGoogle = signal<boolean>(false);

  public ngOnInit(): void {
    this.loadGoogleSettings();
  }

  public async loadGoogleSettings(): Promise<void> {
    try {
      const data = await this.svc.getIntegrationsSettings();
      this.ga4MeasurementId.set(data.ga4MeasurementId || '');
      this.ga4PropertyId.set(data.ga4PropertyId || '');
      this.gscVerificationToken.set(data.googleSiteVerification || '');
      this.gscSiteUrl.set(data.gscSiteUrl || '');
      this.geminiApiKey.set(data.geminiApiKey || '');
    } catch (e) {
      console.warn('Failed to load integrations settings', e);
    }
  }

  public async saveGoogleSettings(
    event: Event, 
    measId: HTMLInputElement, 
    propId: HTMLInputElement, 
    verifyToken: HTMLInputElement, 
    siteUrl: HTMLInputElement, 
    privateKey: HTMLTextAreaElement,
    geminiKey: HTMLInputElement
  ): Promise<void> {
    event.preventDefault();
    this.savingGoogle.set(true);

    const clientEmail = privateKey.value ? extractClientEmail(privateKey.value) : '';
    const formattedPrivateKey = privateKey.value ? extractPrivateKey(privateKey.value) : '';

    const payload: any = {
      ga4MeasurementId: measId.value.trim(),
      ga4PropertyId: propId.value.trim(),
      googleSiteVerification: verifyToken.value.trim(),
      gscSiteUrl: siteUrl.value.trim(),
      geminiApiKey: geminiKey.value.trim()
    };

    if (privateKey.value) {
      payload.clientEmail = clientEmail;
      payload.privateKey = formattedPrivateKey;
    }

    try {
      await this.svc.saveIntegrationsSettings(payload);
      this.svc.showToast('success', 'Credentials Saved', 'Successfully updated Google GA4, GSC and Gemini API settings.');
      privateKey.value = '';
      await this.loadGoogleSettings();
    } catch (err) {
      this.svc.showToast('error', 'Update Failed', err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      this.savingGoogle.set(false);
    }
  }

  // Ad Network updates
  public toggleProvider(providerId: string, enabled: boolean): void {
    this.svc.updateAdProviderSettings(providerId, { enabled });
    this.svc.showToast('success', 'Provider State Changed', `Successfully updated network status.`);
  }

  public togglePlacement(providerId: string, placement: 'leaderboard' | 'sidebar' | 'inFeed', active: boolean): void {
    const current = this.svc.adProviders().find(p => p.id === providerId);
    if (!current) return;
    
    const nextPlacements = {
      ...current.placements,
      [placement]: active
    };
    
    this.svc.updateAdProviderSettings(providerId, { placements: nextPlacements });
    this.svc.showToast('success', 'Placement Updated', `Successfully updated ad placement configuration.`);
  }

  public updateCredential(providerId: string, fieldName: string, value: string): void {
    const current = this.svc.adProviders().find(p => p.id === providerId);
    if (!current) return;

    const nextCredentials = {
      ...current.credentials,
      [fieldName]: value
    };

    this.svc.updateAdProviderSettings(providerId, { credentials: nextCredentials }, false);
  }
}
