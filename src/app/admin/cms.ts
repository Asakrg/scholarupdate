import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';

// Import newly refactored glassmorphic CMS widgets
import { CmsStatsComponent } from './components/cms-stats';
import { CmsChartsComponent } from './components/cms-charts';
import { CmsCrawlerComponent } from './components/cms-crawler';
import { CmsTableComponent } from './components/cms-table';
import { CmsFormComponent } from './components/cms-form';
import { CmsAdsComponent } from './components/cms-ads';
import { CmsResourcesComponent } from './components/cms-resources';
import { CmsDraftsComponent } from './components/cms-drafts';
import { CmsSettingsComponent } from './components/cms-settings';

@Component({
  selector: 'app-admin-cms',
  imports: [
    CommonModule, 
    RouterLink, 
    MatIconModule, 
    CmsStatsComponent,
    CmsChartsComponent,
    CmsCrawlerComponent,
    CmsTableComponent,
    CmsFormComponent,
    CmsAdsComponent,
    CmsResourcesComponent,
    CmsDraftsComponent,
    CmsSettingsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Full-screen Dashboard Canvas -->
    <div id="cms-dashboard-canvas" class="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden">
      
      <!-- Ambient Glow Blobs -->
      <div class="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>

      <!-- 1. LEFT SIDEBAR (Desktop layout, pinned) -->
      <aside class="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-900/60 border-r border-white/10 backdrop-blur-xl z-20">
        
        <!-- Sidebar Brand Logo & Title -->
        <div class="px-6 py-5 border-b border-white/10 flex items-center gap-2 select-none shrink-0">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <mat-icon class="!w-5 !h-5 !text-[20px]">admin_panel_settings</mat-icon>
          </div>
          <div>
            <span class="font-display font-bold text-sm tracking-tight text-white block">ScholarshipHub</span>
            <span class="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">ADMIN CONTROL</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
          <!-- Overview Dashboard -->
          <button (click)="currentTab.set('dashboard')" 
                  [class]="getSidebarLinkClass(currentTab() === 'dashboard')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">dashboard</mat-icon>
            <span>Overview Board</span>
          </button>

          <!-- Scholarship Index -->
          <button (click)="currentTab.set('scholarships')" 
                  [class]="getSidebarLinkClass(currentTab() === 'scholarships')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">list_alt</mat-icon>
            <span>Scholarship Index</span>
          </button>

          <!-- Agent Scraper Console -->
          <button (click)="currentTab.set('crawler')" 
                  [class]="getSidebarLinkClass(currentTab() === 'crawler')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">smart_toy</mat-icon>
            <span>Agent Crawler</span>
          </button>

          <!-- Pending Drafts Queue -->
          <button (click)="currentTab.set('drafts')" 
                  [class]="getSidebarLinkClass(currentTab() === 'drafts')">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <mat-icon class="!w-4 !h-4 !text-[18px]">pending_actions</mat-icon>
                <span>Pending Drafts</span>
              </div>
              <!-- Notification Badge -->
              <span *ngIf="svc.autoDrafts().length > 0"
                    class="px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-600 text-white rounded-full leading-none animate-pulse">
                {{ svc.autoDrafts().length }}
              </span>
            </div>
          </button>

          <!-- Resource Guides FAQs -->
          <button (click)="currentTab.set('resources')" 
                  [class]="getSidebarLinkClass(currentTab() === 'resources')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">menu_book</mat-icon>
            <span>Guides & FAQs</span>
          </button>

          <!-- Ad Monetization -->
          <button (click)="currentTab.set('earnings')" 
                  [class]="getSidebarLinkClass(currentTab() === 'earnings')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">monetization_on</mat-icon>
            <span>Ad Earnings</span>
          </button>

          <!-- System Settings -->
          <button (click)="currentTab.set('settings')" 
                  [class]="getSidebarLinkClass(currentTab() === 'settings')">
            <mat-icon class="!w-4 !h-4 !text-[18px]">settings</mat-icon>
            <span>Control Settings</span>
          </button>
        </nav>

        <!-- Sidebar User Footer -->
        <div class="p-4 border-t border-white/10 bg-slate-950/20 shrink-0">
          <div class="flex items-center justify-between">
            <div class="min-w-0 pr-2">
              <span class="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Logged In</span>
              <span class="text-xs font-sans text-slate-350 truncate block font-medium" [title]="svc.currentUser()?.email">
                {{ svc.currentUser()?.email }}
              </span>
            </div>
            <button (click)="logout()" 
                    class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                    title="Sign Out">
              <mat-icon class="!w-4 !h-4 !text-[16px]">logout</mat-icon>
            </button>
          </div>
        </div>

      </aside>

      <!-- 2. MOBILE TOP NAV BAR -->
      <div class="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10 shrink-0 sticky top-0 z-20 w-full">
        <div class="flex items-center gap-2 select-none">
          <button (click)="isMobileSidebarOpen.set(!isMobileSidebarOpen())"
                  class="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer mr-1">
            <mat-icon class="!w-5 !h-5 !text-[20px]">menu</mat-icon>
          </button>
          <span class="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
            {{ getPageTitle() }}
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <button routerLink="/" class="p-1 rounded bg-slate-800 text-slate-450 hover:text-slate-200 transition-colors">
            <mat-icon class="!w-4 !h-4 !text-[16px]">visibility</mat-icon>
          </button>
          <button (click)="logout()" class="p-1 rounded bg-slate-800 text-slate-450 hover:text-slate-200 transition-colors">
            <mat-icon class="!w-4 !h-4 !text-[16px]">logout</mat-icon>
          </button>
        </div>
      </div>

      <!-- 3. MOBILE SIDEBAR OVERLAY (Drawer) -->
      @if (isMobileSidebarOpen()) {
        <div class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity" (click)="isMobileSidebarOpen.set(false)"></div>
        
        <aside class="lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/10 z-45 flex flex-col justify-between transition-transform duration-300">
          <div>
            <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between select-none">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <mat-icon class="!w-5 !h-5 !text-[20px]">admin_panel_settings</mat-icon>
                </div>
                <div>
                  <span class="font-display font-bold text-sm text-white block">ScholarshipHub</span>
                  <span class="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">ADMIN</span>
                </div>
              </div>
              <button (click)="isMobileSidebarOpen.set(false)" class="text-slate-400 hover:text-slate-200 cursor-pointer">
                <mat-icon class="!w-5 !h-5 !text-[20px]">close</mat-icon>
              </button>
            </div>

            <nav class="px-4 py-6 space-y-1.5">
              <button (click)="selectMobileTab('dashboard')" [class]="getSidebarLinkClass(currentTab() === 'dashboard')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">dashboard</mat-icon>
                <span>Overview Board</span>
              </button>

              <button (click)="selectMobileTab('scholarships')" [class]="getSidebarLinkClass(currentTab() === 'scholarships')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">list_alt</mat-icon>
                <span>Scholarship Index</span>
              </button>

              <button (click)="selectMobileTab('crawler')" [class]="getSidebarLinkClass(currentTab() === 'crawler')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">smart_toy</mat-icon>
                <span>Agent Crawler</span>
              </button>

              <button (click)="selectMobileTab('drafts')" [class]="getSidebarLinkClass(currentTab() === 'drafts')">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <mat-icon class="!w-4 !h-4 !text-[18px]">pending_actions</mat-icon>
                    <span>Pending Drafts</span>
                  </div>
                  <span *ngIf="svc.autoDrafts().length > 0" class="px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                    {{ svc.autoDrafts().length }}
                  </span>
                </div>
              </button>

              <button (click)="selectMobileTab('resources')" [class]="getSidebarLinkClass(currentTab() === 'resources')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">menu_book</mat-icon>
                <span>Guides & FAQs</span>
              </button>

              <button (click)="selectMobileTab('earnings')" [class]="getSidebarLinkClass(currentTab() === 'earnings')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">monetization_on</mat-icon>
                <span>Ad Earnings</span>
              </button>

              <button (click)="selectMobileTab('settings')" [class]="getSidebarLinkClass(currentTab() === 'settings')">
                <mat-icon class="!w-4 !h-4 !text-[18px]">settings</mat-icon>
                <span>Control Settings</span>
              </button>
            </nav>
          </div>

          <div class="p-4 border-t border-white/10 bg-slate-950/20">
            <span class="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-1">Logged In</span>
            <span class="text-xs font-sans text-slate-350 truncate block font-semibold mb-2">
              {{ svc.currentUser()?.email }}
            </span>
          </div>
        </aside>
      }

      <!-- 4. CORE PAGE CONTENT WINDOW -->
      <div class="flex-grow lg:pl-68 flex flex-col min-w-0 w-full relative z-10">
        
        <!-- Sticky Main Header Bar (Desktop only, for branding/quick links) -->
        <header class="hidden lg:flex items-center justify-between border-b border-white/10 bg-slate-950/20 px-8 py-5 select-none shrink-0">
          <div>
            <h1 class="text-lg font-display font-semibold text-white tracking-tight">
              {{ getPageTitle() }}
            </h1>
            <p class="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mt-0.5">
              SYSTEM PORTAL / ACTIVE
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button routerLink="/" 
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs font-sans shadow-sm transition-all cursor-pointer">
              <mat-icon class="!w-4 !h-4 !text-[14px]">visibility</mat-icon>
              <span>View Site</span>
            </button>
            
            <button (click)="openCreateForm()"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-sans shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all border border-indigo-500/30 cursor-pointer">
              <mat-icon class="!w-4 !h-4 !text-[15px]">post_add</mat-icon>
              <span>Publish New</span>
            </button>
          </div>
        </header>

        <!-- Main Body Page Views Injection -->
        <main class="flex-grow px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto overflow-y-auto">
          
          <!-- Page 1: Dashboard Overview -->
          @if (currentTab() === 'dashboard') {
            <div class="space-y-8">
              <!-- Summary Numbers Stats -->
              <app-cms-stats />
              <!-- Google traffic trend and views charts -->
              <app-cms-charts />
            </div>
          }

          <!-- Page 2: Scholarship Table and slide form -->
          @if (currentTab() === 'scholarships') {
            <div class="space-y-6">
              <!-- Search and data list grid index table -->
              <app-cms-table (editClick)="openEditForm($event)" />
            </div>
          }

          <!-- Page 3: Crawling Console control CLI -->
          @if (currentTab() === 'crawler') {
            <app-cms-crawler (reviewDraft)="loadAiOpportunityIntoForm($event)" />
          }

          <!-- Page 4: Discovered Queue approval board -->
          @if (currentTab() === 'drafts') {
            <app-cms-drafts (editDraft)="loadAiOpportunityIntoForm($event)" />
          }

          <!-- Page 5: Resource Guides and FAQs -->
          @if (currentTab() === 'resources') {
            <app-cms-resources />
          }

          <!-- Page 6: Ad Earnings statistics -->
          @if (currentTab() === 'earnings') {
            <app-cms-ads />
          }

          <!-- Page 7: Unified Settings Panel -->
          @if (currentTab() === 'settings') {
            <app-cms-settings />
          }

          <!-- Slide-over editor form overlay -->
          @if (isFormActive()) {
            <app-cms-form [scholarship]="selectedScholarship()" 
                          (close)="closeForm()" 
                          (save)="closeForm()" />
          }

        </main>
      </div>

    </div>
  `
})
export class AdminCMSComponent implements OnInit {
  public svc = inject(ScholarshipService);
  private router = inject(Router);

  // Layout View signals
  public currentTab = signal<'dashboard' | 'scholarships' | 'crawler' | 'drafts' | 'resources' | 'earnings' | 'settings'>('dashboard');
  public isMobileSidebarOpen = signal<boolean>(false);

  // Form coordinator states
  public isFormActive = signal<boolean>(false);
  public selectedScholarship = signal<Scholarship | null>(null);

  public ngOnInit(): void {
    if (!this.svc.isAuthorizedAdmin()) {
      this.router.navigate(['/adm/auth']);
    }
  }

  // Mobile navigation helper
  public selectMobileTab(tab: 'dashboard' | 'scholarships' | 'crawler' | 'drafts' | 'resources' | 'earnings' | 'settings'): void {
    this.currentTab.set(tab);
    this.isMobileSidebarOpen.set(false);
  }

  // Sidebar link class builder
  public getSidebarLinkClass(isActive: boolean): string {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none w-full text-left border-l-4 ';
    return isActive
      ? base + 'bg-indigo-600/10 text-indigo-400 border-indigo-500 shadow-inner'
      : base + 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40';
  }

  // Title strings mapping
  public getPageTitle(): string {
    switch (this.currentTab()) {
      case 'dashboard': return 'System Performance Dashboard';
      case 'scholarships': return 'Scholarships Index Manager';
      case 'crawler': return 'Firecrawl Agent Scraper Console';
      case 'drafts': return 'Pending Discovered Drafts';
      case 'resources': return 'Resources & Guides manager';
      case 'earnings': return 'Monetization & Ad Earnings';
      case 'settings': return 'CMS Control Settings & Access';
    }
  }

  // Action methods
  public openCreateForm(): void {
    this.selectedScholarship.set(null);
    this.isFormActive.set(true);
  }

  public openEditForm(item: Scholarship): void {
    this.selectedScholarship.set(item);
    this.isFormActive.set(true);
    this.scrollFormIntoView();
  }

  public loadAiOpportunityIntoForm(item: Scholarship): void {
    this.selectedScholarship.set(item);
    this.isFormActive.set(true);
    this.scrollFormIntoView();
  }

  public closeForm(): void {
    this.isFormActive.set(false);
    this.selectedScholarship.set(null);
  }

  public async logout(): Promise<void> {
    await this.svc.logout();
    this.router.navigate(['/adm/auth']);
  }

  private scrollFormIntoView(): void {
    setTimeout(() => {
      const el = document.getElementById('cms-editor-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }
}
