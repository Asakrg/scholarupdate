import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../services/scholarship';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Premium Academic Footer — Enhanced Glassmorphism -->
    <footer id="academic-index-footer" class="frost-medium border-t border-white/10 mt-16 font-sans relative overflow-hidden">
      <!-- Background glow -->
      <div class="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500/8 blur-[80px] pointer-events-none orb-drift-2"></div>
      <div class="absolute bottom-[-20%] left-[-5%] w-56 h-56 rounded-full bg-emerald-500/6 blur-[60px] pointer-events-none orb-drift-3"></div>
      
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          <!-- Column 1: Platform Synopsis -->
          <div class="col-span-2 lg:col-span-1 space-y-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold tracking-tight text-sm border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                S
              </span>
              <div class="flex flex-col">
                <span class="text-sm font-display font-black tracking-tight text-white leading-none">ScholarshipHub</span>
                <span class="text-[9px] font-mono tracking-wider font-bold text-slate-500 uppercase mt-0.5">Academic Matrix</span>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              A meticulously curated directory tracking premium fully-funded fellowships, research grants, and graduate assistantships globally. Connecting top scholars with world-class institutions.
            </p>
            
            <!-- Social icons -->
            <div class="flex items-center gap-3">
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg frost-light text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg frost-light text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg frost-light text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all">
                <mat-icon class="!w-4 !h-4 !text-[16px]">mail</mat-icon>
              </a>
            </div>
          </div>

          <!-- Column 2: Browse -->
          <div class="space-y-4">
            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-white">Browse</h4>
            <div class="flex flex-col gap-2 text-xs text-slate-400">
              <a routerLink="/" class="hover:text-white transition-colors">All Scholarships</a>
              <a routerLink="/categories" class="hover:text-white transition-colors">Categories & Tags</a>
              <a routerLink="/" class="hover:text-white transition-colors">Fully Funded</a>
              <a routerLink="/" class="hover:text-white transition-colors">Undergraduate</a>
              <a routerLink="/" class="hover:text-white transition-colors">Graduate & PhD</a>
            </div>
          </div>

          <!-- Column 3: Company -->
          <div class="space-y-4">
            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-white">Company</h4>
            <div class="flex flex-col gap-2 text-xs text-slate-400">
              <a href="#" class="hover:text-white transition-colors">About Us</a>
              <a href="#" class="hover:text-white transition-colors">Blog & Resources</a>
              <a href="#" class="hover:text-white transition-colors">Contact Support</a>
              <a href="#" class="hover:text-white transition-colors">Partner with Us</a>
              <a href="#" class="hover:text-white transition-colors">Careers</a>
            </div>
          </div>

          <!-- Column 4: Newsletter Mini CTA -->
          <div class="space-y-4">
            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-white">Priority Alerts</h4>
            <p class="text-xs text-slate-400">
              Get instant email alerts when new scholarships open.
            </p>

            <div class="space-y-2.5">
              <div class="flex items-center gap-2">
                <input type="email" #subEmail
                       placeholder="your@email.com"
                       (keydown.enter)="onSubscribe(subEmail.value); subEmail.value = ''"
                       class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-sans backdrop-blur-sm transition-all" />
                
                <button (click)="onSubscribe(subEmail.value); subEmail.value = ''"
                        class="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer border border-indigo-500/30 shrink-0">
                  Join
                </button>
              </div>

              @if (statusMessage()) {
                <div [class]="'text-[11px] px-3 py-1.5 rounded flex items-center gap-1.5 ' + 
                              (isError() ? 'bg-red-950/40 text-red-200 border border-red-500/20' : 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/20')">
                  <mat-icon class="!w-3.5 !h-3.5 !text-[12px]">{{ isError() ? 'error_outline' : 'check_circle_outline' }}</mat-icon>
                  <span>{{ statusMessage() }}</span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-slate-500">
            <p>© 2026 ScholarshipHub International.</p>
            <span class="hidden sm:inline">•</span>
            <p class="text-slate-600 inline-flex items-center gap-1">Made with <mat-icon class="!w-3 !h-3 !text-[12px] text-rose-500">favorite</mat-icon> for students everywhere</p>
          </div>
          <div class="flex items-center gap-4 text-[10px] font-mono text-slate-600">
            <a href="#" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" class="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" class="hover:text-slate-400 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  private svc = inject(ScholarshipService);

  public statusMessage = signal<string | null>(null);
  public isError = signal<boolean>(false);

  public async onSubscribe(email: string): Promise<void> {
    this.statusMessage.set(null);
    this.isError.set(false);

    const val = email ? email.trim() : '';
    if (!val) {
      this.isError.set(true);
      this.statusMessage.set("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      this.isError.set(true);
      this.statusMessage.set("Please enter a valid email.");
      return;
    }

    try {
      await this.svc.subscribeEmail(val);
      this.isError.set(false);
      this.statusMessage.set("Subscribed! You'll receive priority alerts.");
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(err.message || String(err));
    }
  }
}
