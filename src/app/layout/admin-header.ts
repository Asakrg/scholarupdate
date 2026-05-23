import { Component, inject, signal, ChangeDetectionStrategy, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../services/scholarship';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header id="scholarshiphub-admin-sticky-header" 
            [class]="'sticky top-0 z-50 w-full transition-all duration-500 ' + (scrolled() ? 'py-0' : 'py-3')">
      
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div [class]="'flex items-center justify-between px-4 sm:px-6 transition-all duration-500 border ' + 
                      (scrolled() 
                        ? 'h-14 bg-slate-950/90 backdrop-blur-2xl border-indigo-500/20 rounded-none sm:rounded-b-2xl shadow-[0_4px_30px_rgba(99,102,241,0.2)] border-t-0' 
                        : 'h-16 bg-slate-900/80 backdrop-blur-2xl border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]')">
          
          <!-- Logo Brand with Admin Tag -->
          <div class="flex items-center gap-4 shrink-0">
            <a routerLink="/adm" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
              <span [class]="'inline-flex items-center justify-center rounded-xl text-white font-mono font-bold tracking-tight border border-indigo-500/30 transition-all duration-300 ' +
                             (scrolled() ? 'h-8 w-8 text-xs bg-indigo-600 shadow-[0_0_16px_rgba(99,102,241,0.4)]' : 'h-9 w-9 text-sm bg-slate-850 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]')">
                A
              </span>
              <div class="flex flex-col">
                <span class="font-display font-bold text-white tracking-tight leading-none text-xs sm:text-sm">CMS Terminal</span>
                <span class="text-[8px] font-mono tracking-[0.1em] font-bold text-slate-400 uppercase mt-0.5">Control Console</span>
              </div>
            </a>
          </div>

          <!-- Services Connection Health Status Badges -->
          <div class="hidden lg:flex items-center gap-3 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl shrink-0">
            <!-- Firebase Badge -->
            <div class="flex items-center gap-1.5">
              <span [class]="'h-2 w-2 rounded-full ' + (svc.isFirebaseEnabled() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')"></span>
              <span class="text-[9px] font-mono font-bold text-slate-400 uppercase">
                {{ svc.isFirebaseEnabled() ? 'Firestore: Live Sync' : 'Firestore: Local Cache' }}
              </span>
            </div>
            <span class="text-white/10 text-[10px]">|</span>
            <!-- Firecrawl Scraper Badge -->
            <div class="flex items-center gap-1.5">
              <span [class]="'h-2 w-2 rounded-full ' + (svc.isFirecrawlEnabled() ? 'bg-indigo-400 animate-pulse' : 'bg-amber-500')"></span>
              <span class="text-[9px] font-mono font-bold text-slate-400 uppercase">
                {{ svc.isFirecrawlEnabled() ? 'Crawler Agent: Active' : 'Crawler Agent: Mock' }}
              </span>
            </div>
          </div>

          <!-- Navigation Action Bar -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()"
                    class="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/10 text-slate-450 hover:text-white transition-all cursor-pointer focus:outline-none"
                    [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <mat-icon class="!w-4 !h-4 !text-[16px]">
                {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </mat-icon>
            </button>

            <!-- User Auth Profile & Options -->
            @if (svc.currentUser()) {
              <div class="flex items-center gap-2">
                <!-- User tag displaying active role -->
                <div class="hidden sm:flex flex-col text-right">
                  <span class="text-[10px] text-slate-355 font-medium max-w-[130px] truncate">{{ svc.currentUser()?.email }}</span>
                  <span [class]="'text-[8px] font-mono font-bold uppercase tracking-wider mt-0.5 ' + 
                                  (svc.currentUser()?.role === 'super-admin' ? 'text-indigo-400' : 'text-purple-400')">
                    {{ svc.currentUser()?.role }}
                  </span>
                </div>

                <!-- Preview Site Link -->
                <a routerLink="/" 
                   class="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-[10px] sm:text-[11px] transition-all">
                   <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">visibility</mat-icon>
                   <span class="hidden md:inline">Preview Site</span>
                </a>
                
                <!-- Logout Trigger -->
                <button (click)="onLogout()" 
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 hover:text-rose-250 font-semibold text-[10px] sm:text-[11px] transition-all border border-rose-500/20 cursor-pointer focus:outline-none">
                  <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">logout</mat-icon>
                  <span class="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            }

          </div>

        </div>
      </div>
    </header>
  `
})
export class AdminHeaderComponent implements OnInit {
  public svc = inject(ScholarshipService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  public scrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  public ngOnInit(): void {
    // Dynamically poll backend configuration state
    this.svc.fetchCrawlerHealthStatus();
  }

  public isDarkMode(): boolean {
    return this.themeService.theme() === 'dark';
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public async onLogout(): Promise<void> {
    await this.svc.logout();
    this.router.navigate(['/']);
  }
}
