import { Component, inject, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
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
    <!-- Premium Sticky Header — Normal Full-Width Navbar -->
    <header id="scholarshiphub-sticky-header" 
            [class]="'sticky top-0 z-50 w-full border-b transition-all duration-300 ' + 
                     (scrolled() 
                       ? 'bg-slate-950/90 backdrop-blur-md border-white/10 shadow-lg py-2.5' 
                       : 'bg-slate-950/75 backdrop-blur-sm border-white/5 py-4')">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          
          <!-- Logo Brand -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
              <!-- Animated logo mark -->
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white font-mono font-bold tracking-tight border border-indigo-500/25 bg-indigo-600 shadow-[0_0_16px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                S
              </span>
              <div class="flex flex-col">
                <span class="font-display font-bold text-white tracking-tight leading-none group-hover:text-indigo-350 transition-all duration-300 text-sm">ScholarshipHub</span>
                <span class="text-[8px] font-mono tracking-[0.15em] font-bold text-slate-500 uppercase mt-0.5">Academic Directory</span>
              </div>
            </a>

            <!-- Desktop Navigation Links -->
            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/" routerLinkActive="!text-white !bg-white/10" [routerLinkActiveOptions]="{exact: true}"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Discover
              </a>
              <a routerLink="/categories" routerLinkActive="!text-white !bg-white/10"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Categories
              </a>
              <a routerLink="/resources" routerLinkActive="!text-white !bg-white/10"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Resources
              </a>
              <a routerLink="/about" routerLinkActive="!text-white !bg-white/10"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                About Us
              </a>
              <a routerLink="/contact" routerLinkActive="!text-white !bg-white/10"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Contact
              </a>
              <a routerLink="/privacy" routerLinkActive="!text-white !bg-white/10"
                 class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Privacy
              </a>
            </nav>
          </div>

          <!-- Actions Panel -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()"
                    class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                    [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <mat-icon class="!w-4 !h-4 !text-[16px]">
                {{ isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </mat-icon>
            </button>

            <!-- Admin Portal Link -->
            <a routerLink="/adm" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none">
              <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">admin_panel_settings</mat-icon>
              <span>Admin Portal</span>
            </a>

            <!-- Mobile Hamburger Button -->
            <button (click)="toggleMobileMenu()" 
                    class="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none">
              <mat-icon class="!w-5 !h-5 !text-[20px]">
                {{ mobileMenuOpen() ? 'close' : 'menu' }}
              </mat-icon>
            </button>

          </div>

        </div>
      </div>

      <!-- Mobile Navigation Dropdown Menu -->
      <div *ngIf="mobileMenuOpen()" class="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in">
        <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10" [routerLinkActiveOptions]="{exact: true}"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Discover
        </a>
        <a routerLink="/categories" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Categories
        </a>
        <a routerLink="/resources" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Resources
        </a>
        <a routerLink="/about" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          About Us
        </a>
        <a routerLink="/contact" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Contact
        </a>
        <a routerLink="/privacy" (click)="closeMobileMenu()" routerLinkActive="!text-white !bg-white/10"
           class="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Privacy Policy
        </a>
        <div class="pt-2 border-t border-white/5">
          <a routerLink="/adm" (click)="closeMobileMenu()"
             class="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
            <mat-icon class="!w-4 !h-4 !text-[15px]">admin_panel_settings</mat-icon>
            <span>Admin Portal</span>
          </a>
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
  public mobileMenuOpen = signal(false);

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

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  public async onLogout(): Promise<void> {
    await this.svc.logout();
    this.router.navigate(['/']);
  }
}
