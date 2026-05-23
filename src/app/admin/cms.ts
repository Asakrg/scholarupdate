import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';
import { AdminHeaderComponent } from '../layout/admin-header';

// Import newly refactored glassmorphic CMS widgets
import { CmsStatsComponent } from './components/cms-stats';
import { CmsChartsComponent } from './components/cms-charts';
import { CmsCrawlerComponent } from './components/cms-crawler';
import { CmsTableComponent } from './components/cms-table';
import { CmsFormComponent } from './components/cms-form';
import { CmsUsersSubsComponent } from './components/cms-users-subs';
import { CmsAdsComponent } from './components/cms-ads';
import { CmsResourcesComponent } from './components/cms-resources';

@Component({
  selector: 'app-admin-cms',
  imports: [
    CommonModule, 
    RouterLink, 
    MatIconModule, 
    AdminHeaderComponent, 
    CmsStatsComponent,
    CmsChartsComponent,
    CmsCrawlerComponent,
    CmsTableComponent,
    CmsFormComponent,
    CmsUsersSubsComponent,
    CmsAdsComponent,
    CmsResourcesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CMS Canvas. Dark premium theme with frosted glass aesthetics -->
    <div id="cms-dashboard-canvas" class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      <!-- Ambient Glow Blobs (Background Contrast, No gradients) -->
      <div class="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

      <!-- Sticky Navigation Header (inside container z-index) -->
      <div class="relative z-10">
        <app-admin-header />
      </div>

      <!-- Core CMS Layout body -->
      <main class="relative z-10 flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome banner (Frosted Glass Panel) -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">CMS Core Terminals active</span>
            </div>
            
            <h1 class="text-xl font-display font-semibold text-white tracking-tight">
              Academic CMS Control Station
            </h1>
            <p class="text-xs text-slate-400 font-sans mt-0.5">
              Logged in as: <span class="font-mono font-medium text-indigo-300">{{ svc.currentUser()?.email }}</span>
            </p>
          </div>

          <!-- Add scholarship quick launch -->
          <div class="flex items-center gap-2.5">
            <button (click)="openCreateForm()"
                    class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs font-sans shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_18px_rgba(99,102,241,0.5)] transition-all border border-indigo-500/30 cursor-pointer focus:outline-none backdrop-blur-xl">
              <mat-icon class="!w-4 !h-4 !text-[15px]">post_add</mat-icon>
              <span>Publish Scholarship</span>
            </button>
            <button routerLink="/"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs font-sans shadow-sm transition-all cursor-pointer focus:outline-none backdrop-blur-xl">
              <mat-icon class="!w-4 !h-4 !text-[14px]">visibility</mat-icon>
              <span>View Site</span>
            </button>
          </div>
        </header>

        <!-- Premium Tabs -->
        <div class="flex items-center gap-2 border-b border-white/10 mb-8 pb-px">
          <button (click)="currentTab.set('scholarships')" 
                  [class]="'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (currentTab() === 'scholarships' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Scholarships & Crawling
          </button>
          <button (click)="currentTab.set('resources')" 
                  [class]="'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (currentTab() === 'resources' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Resources Manager
          </button>
          <button (click)="currentTab.set('ads')" 
                  [class]="'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (currentTab() === 'ads' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            Ad Monetization Center
          </button>
          <button (click)="currentTab.set('users')" 
                  [class]="'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer focus:outline-none ' + 
                           (currentTab() === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200')">
            User Settings & Security
          </button>
        </div>

        @if (currentTab() === 'scholarships') {
          <!-- Dynamic Stat Panels Widget -->
          <app-cms-stats />

          <!-- Analytics Charts Widget -->
          <app-cms-charts />

          <!-- Scraper Console & Simulator Stream Widget -->
          <app-cms-crawler (reviewDraft)="loadAiOpportunityIntoForm($event)" />

          <!-- Slide-over editor form overlay -->
          @if (isFormActive()) {
            <app-cms-form [scholarship]="selectedScholarship()" 
                          (close)="closeForm()" 
                          (save)="closeForm()" />
          }

          <!-- Interactive Articles table -->
          <app-cms-table (editClick)="openEditForm($event)" />
        } @else if (currentTab() === 'resources') {
          <!-- CMS Resources control panel component -->
          <app-cms-resources />
        } @else if (currentTab() === 'ads') {
          <!-- Ad Monetization dashboard -->
          <app-cms-ads />
        } @else if (currentTab() === 'users') {
          <!-- Whitelist administration directory & Sub waitlist -->
          <app-cms-users-subs />
        }

      </main>


    </div>
  `
})
export class AdminCMSComponent implements OnInit {
  public svc = inject(ScholarshipService);
  private router = inject(Router);

  // Tab state coordinator
  public currentTab = signal<'scholarships' | 'resources' | 'ads' | 'users'>('scholarships');

  // Form coordinator states
  public isFormActive = signal<boolean>(false);
  public selectedScholarship = signal<Scholarship | null>(null);

  public ngOnInit(): void {
    if (!this.svc.isAuthorizedAdmin()) {
      this.router.navigate(['/adm/auth']);
    }
  }

  public openCreateForm(): void {
    this.currentTab.set('scholarships');
    this.selectedScholarship.set(null);
    this.isFormActive.set(true);
  }

  public openEditForm(item: Scholarship): void {
    this.currentTab.set('scholarships');
    this.selectedScholarship.set(item);
    this.isFormActive.set(true);
    this.scrollFormIntoView();
  }

  public loadAiOpportunityIntoForm(item: Scholarship): void {
    this.currentTab.set('scholarships');
    this.selectedScholarship.set(item);
    this.isFormActive.set(true);
    this.scrollFormIntoView();
  }

  public closeForm(): void {
    this.isFormActive.set(false);
    this.selectedScholarship.set(null);
  }

  private scrollFormIntoView(): void {
    setTimeout(() => {
      const el = document.getElementById('cms-editor-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }
}
