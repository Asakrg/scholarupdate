import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';
import { ThemeService } from '../services/theme';

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
    <div id="cms-dashboard-canvas" class="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      
      <!-- Ambient Glow Blobs -->
      <div class="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>

      <!-- Backdrop Overlay (closes/hides sidebar when user focuses/clicks on main page container) -->
      @if (isSidebarOpen()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity" 
             (click)="isSidebarOpen.set(false)">
        </div>
      }

      <!-- 1. LEFT SIDEBAR DRAWER (Collapsible, slides over on desktop & mobile) -->
      <aside [class]="'fixed inset-y-0 left-0 w-68 bg-slate-950/95 border-r border-white/10 backdrop-blur-xl z-40 flex flex-col justify-between transition-transform duration-300 transform ' + 
                      (isSidebarOpen() ? 'translate-x-0' : '-translate-x-full')">
        
        <div>
          <!-- Sidebar Brand Logo & Title -->
          <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between select-none shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <mat-icon class="!w-5 !h-5 !text-[20px]">admin_panel_settings</mat-icon>
              </div>
              <div>
                <span class="font-display font-bold text-sm tracking-tight text-white block">ScholarshipHub</span>
                <span class="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">ADMIN CONTROL</span>
              </div>
            </div>
            <!-- Hide Sidebar Button -->
            <button (click)="isSidebarOpen.set(false)" 
                    class="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer flex items-center justify-center border border-white/5 hover:border-white/10 transition-colors"
                    title="Close Sidebar">
              <mat-icon class="!w-4 !h-4 !text-[18px]">close</mat-icon>
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="px-4 py-6 space-y-1.5 overflow-y-auto">
            <!-- Overview Dashboard -->
            <button (click)="selectTab('dashboard')" 
                    [class]="getSidebarLinkClass(currentTab() === 'dashboard')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">dashboard</mat-icon>
              <span>Overview Board</span>
            </button>

            <!-- Scholarship Index -->
            <button (click)="selectTab('scholarships')" 
                    [class]="getSidebarLinkClass(currentTab() === 'scholarships')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">list_alt</mat-icon>
              <span>Scholarship Index</span>
            </button>

            <!-- Agent Scraper Console -->
            <button (click)="selectTab('crawler')" 
                    [class]="getSidebarLinkClass(currentTab() === 'crawler')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">smart_toy</mat-icon>
              <span>Agent Crawler</span>
            </button>

            <!-- Pending Drafts Queue -->
            <button (click)="selectTab('drafts')" 
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
            <button (click)="selectTab('resources')" 
                    [class]="getSidebarLinkClass(currentTab() === 'resources')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">menu_book</mat-icon>
              <span>Guides & FAQs</span>
            </button>

            <!-- Ad Monetization -->
            <button (click)="selectTab('earnings')" 
                    [class]="getSidebarLinkClass(currentTab() === 'earnings')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">monetization_on</mat-icon>
              <span>Ad Earnings</span>
            </button>

            <!-- System Settings -->
            <button (click)="selectTab('settings')" 
                    [class]="getSidebarLinkClass(currentTab() === 'settings')">
              <mat-icon class="!w-4 !h-4 !text-[18px]">settings</mat-icon>
              <span>Control Settings</span>
            </button>
          </nav>
        </div>

        <!-- Sidebar User Footer -->
        <div class="p-4 border-t border-white/10 bg-slate-950/20 shrink-0">
          <div class="flex items-center justify-between">
            <div class="min-w-0 pr-2">
              <span class="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Logged In</span>
              <span class="text-xs font-sans text-slate-300 truncate block font-medium" [title]="svc.currentUser()?.email">
                {{ svc.currentUser()?.email }}
              </span>
            </div>
            <button (click)="logout()" 
                    class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                    title="Sign Out">
              <mat-icon class="!w-4 !h-4 !text-[16px]">logout</mat-icon>
            </button>
          </div>
        </div>

      </aside>

      <!-- 2. CORE PAGE CONTENT WINDOW -->
      <div class="flex-grow flex flex-col min-w-0 w-full relative z-10">
        
        <!-- Sticky Main Dashboard Topbar (Unified Desktop & Mobile) -->
        <header class="flex items-center justify-between border-b border-white/10 bg-slate-950/30 backdrop-blur-md px-6 py-4 select-none shrink-0 sticky top-0 z-20 w-full">
          <div class="flex items-center gap-3">
            <!-- Sidebar Hamburger Toggle -->
            <button (click)="isSidebarOpen.set(!isSidebarOpen())"
                    class="p-1.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer hover:border-white/15 transition-all flex items-center justify-center"
                    title="Toggle Sidebar Menu">
              <mat-icon class="!w-5 !h-5 !text-[20px]">menu</mat-icon>
            </button>
            
            <div>
              <span class="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block leading-none">ScholarshipHub CMS</span>
              <h1 class="text-xs sm:text-sm font-display font-semibold text-white tracking-tight mt-0.5 leading-none">
                {{ getPageTitle() }}
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()"
                    class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer focus:outline-none"
                    [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <mat-icon class="!w-4 !h-4 !text-[16px]">
                {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </mat-icon>
            </button>

            <button routerLink="/" 
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all cursor-pointer">
              <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">visibility</mat-icon>
              <span class="hidden sm:inline">View Site</span>
            </button>
            
            <button (click)="openCreateForm()"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all border border-indigo-500/30 cursor-pointer">
              <mat-icon class="!w-3.5 !h-3.5 !text-[15px]">post_add</mat-icon>
              <span class="hidden sm:inline">Publish New</span>
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
  public themeService = inject(ThemeService);
  private router = inject(Router);

  // Layout View signals
  public currentTab = signal<'dashboard' | 'scholarships' | 'crawler' | 'drafts' | 'resources' | 'earnings' | 'settings'>('dashboard');
  public isSidebarOpen = signal<boolean>(false);

  // Form coordinator states
  public isFormActive = signal<boolean>(false);
  public selectedScholarship = signal<Scholarship | null>(null);

  public ngOnInit(): void {
    if (!this.svc.isAuthorizedAdmin()) {
      this.router.navigate(['/adm/auth']);
    }
  }

  public isDarkMode(): boolean {
    return this.themeService.theme() === 'dark';
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Sidebar selection and auto-hide coordinator
  public selectTab(tab: 'dashboard' | 'scholarships' | 'crawler' | 'drafts' | 'resources' | 'earnings' | 'settings'): void {
    this.currentTab.set(tab);
    this.isSidebarOpen.set(false);
  }

  // Sidebar link class builder
  public getSidebarLinkClass(isActive: boolean): string {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none w-full text-left border-l-4 ';
    return isActive
      ? base + 'bg-indigo-600/10 text-indigo-400 border-indigo-500 shadow-inner'
      : base + 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40';
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
