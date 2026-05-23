import { Component, inject, signal, ChangeDetectionStrategy, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../services/scholarship';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Premium Sticky Header — Transforms on Scroll -->
    <header id="scholarshiphub-sticky-header" 
            [class]="'sticky top-0 z-50 w-full transition-all duration-500 ' + (scrolled() ? 'py-0' : 'py-3')">
      
      <!-- Backdrop blur container -->
      <div [class]="'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-500 ' + (scrolled() ? '' : '')">
        <div [class]="'flex items-center justify-between px-4 sm:px-6 transition-all duration-500 border ' + 
                      (scrolled() 
                        ? 'h-14 bg-slate-950/85 backdrop-blur-xl border-white/8 rounded-none sm:rounded-b-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-t-0' 
                        : 'h-16 bg-slate-950/70 backdrop-blur-xl border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]')">
          
          <!-- Logo Brand -->
          <div class="flex items-center gap-6 md:gap-8">
            <a routerLink="/" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
              <!-- Animated logo mark -->
              <span [class]="'inline-flex items-center justify-center rounded-xl text-white font-mono font-bold tracking-tight border border-indigo-500/25 transition-all duration-300 ' +
                             (scrolled() ? 'h-8 w-8 text-xs bg-indigo-600 shadow-[0_0_16px_rgba(99,102,241,0.3)]' : 'h-9 w-9 text-sm bg-indigo-950 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]')">
                S
              </span>
              <div class="flex flex-col">
                <span [class]="'font-display font-bold text-white tracking-tight leading-none group-hover:text-indigo-300 transition-all duration-300 ' + 
                               (scrolled() ? 'text-xs' : 'text-sm')">ScholarshipHub</span>
                <span class="text-[8px] font-mono tracking-[0.15em] font-bold text-slate-500 uppercase mt-0.5">Academic Directory</span>
              </div>
            </a>

            <!-- Desktop Navigation Tabs -->
            <nav class="hidden md:flex items-center gap-0.5 p-1 rounded-xl border border-white/8 bg-white/[0.03]">
              <a routerLink="/" routerLinkActive="!bg-indigo-600/20 !border-indigo-500/25 !text-white" [routerLinkActiveOptions]="{exact: true}"
                 class="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/8 transition-all flex items-center gap-1.5 border border-transparent">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">explore</mat-icon>
                <span>Discover</span>
              </a>
              <a routerLink="/categories" routerLinkActive="!bg-indigo-600/20 !border-indigo-500/25 !text-white"
                 class="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/8 transition-all flex items-center gap-1.5 border border-transparent">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">category</mat-icon>
                <span>Categories</span>
              </a>
              <a routerLink="/resources" routerLinkActive="!bg-indigo-600/20 !border-indigo-500/25 !text-white"
                 class="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/8 transition-all flex items-center gap-1.5 border border-transparent">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">auto_stories</mat-icon>
                <span>Resources</span>
              </a>
            </nav>
          </div>

          <!-- Mobile Compact Navigation -->
          <div class="flex md:hidden items-center gap-1 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/8 shrink-0">
            <a routerLink="/" routerLinkActive="text-indigo-400 font-bold" [routerLinkActiveOptions]="{exact: true}"
               class="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5">
              Explore
            </a>
            <span class="text-slate-700 text-[8px]">|</span>
            <a routerLink="/categories" routerLinkActive="text-indigo-400 font-bold"
               class="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5">
              Tags
            </a>
            <span class="text-slate-700 text-[8px]">|</span>
            <a routerLink="/resources" routerLinkActive="text-indigo-400 font-bold"
               class="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5">
              Guides
            </a>
          </div>

          <!-- Action Bar -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()"
                    class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                    [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <mat-icon class="!w-4 !h-4 !text-[16px]">
                {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </mat-icon>
            </button>



          </div>

        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  public svc = inject(ScholarshipService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  public scrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 40);
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
