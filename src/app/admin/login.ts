import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../services/scholarship';
import { AdminHeaderComponent } from '../layout/admin-header';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, MatIconModule, AdminHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Sign In workspace panel -->
    <div id="login-stage-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden z-10">
      
      <!-- Glow background glass blobs (Solid color circular layers with extreme blur, no gradients allowed) -->
      <div class="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-[30%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-[-10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>

      <!-- Primary nav header bar -->
      <app-admin-header />

      <!-- Centered lockbox -->
      <main class="flex-grow flex items-center justify-center p-4 relative">
        
        <div class="w-full max-w-md border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
          
          <!-- Locked emblem logo -->
          <div class="text-center mb-8">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-indigo-400 mb-4 shadow-sm backdrop-blur-sm">
              <mat-icon class="!w-6 !h-6 !text-[24px]">lock_person</mat-icon>
            </div>
            
            <h1 class="text-xl font-display font-black text-white tracking-tight">
              Administrative Gate Entry
            </h1>
            <p class="text-xs text-slate-400 font-sans mt-1">
              Authorized personnel credentials authentication point
            </p>
          </div>

          <!-- Alert notifications feedback block -->
          @if (errorMessage()) {
            <div class="p-4 rounded-xl bg-rose-950/65 text-rose-350 text-xs border border-rose-500/25 mb-6 flex items-start gap-2 max-w-md leading-relaxed backdrop-blur-sm animate-fade-in">
              <mat-icon class="!w-4 !h-4 !text-[16px] text-rose-400 flex-shrink-0 mt-0.5">warning</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="space-y-4">
            
            <!-- Email / Password Authentication form -->
            <form (submit)="onEmailLogin($event, emailInput, passwordInput)" class="space-y-3.5 mb-2">
              <div>
                <label class="block text-[10px] font-mono font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
                <input type="email" #emailInput required
                       placeholder="admin@scholarshiphub.com"
                       class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
              
              <div>
                <label class="block text-[10px] font-mono font-semibold text-slate-400 mb-1 uppercase tracking-wider">Security Password</label>
                <input type="password" #passwordInput required
                       placeholder="••••••••"
                       class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>

              <button type="submit"
                      class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-all cursor-pointer select-none mt-1">
                <mat-icon class="!w-4 !h-4 !text-[15px]">login</mat-icon>
                <span>Sign In with Password</span>
              </button>
            </form>

            <div class="flex items-center gap-3 py-1 text-[9px] uppercase font-mono text-slate-500">
              <span class="flex-grow border-t border-white/5"></span>
              <span>OR AUTHENTICATE WITH PROVIDERS</span>
              <span class="flex-grow border-t border-white/5"></span>
            </div>
            
            <!-- Google single sign on popup launcher -->
            <button (click)="onGoogleLogin()"
                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer transition-all focus:outline-none backdrop-blur-sm shadow-sm">
              <svg class="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Authenticate with Google Account</span>
            </button>

            <!-- Flat separator -->
            <div class="flex items-center gap-3 py-1 text-[9px] uppercase font-mono text-slate-500">
              <span class="flex-grow border-t border-white/5"></span>
              <span>or bypass for developer testing</span>
              <span class="flex-grow border-t border-white/5"></span>
            </div>

            <!-- Instant local simulation bypass buttons (No gradients) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button (click)="onLocalDemoBypass('super-admin')"
                      class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-[0_0_12px_rgba(99,102,241,0.2)] focus:outline-none backdrop-blur-sm">
                <mat-icon class="!w-4 !h-4 !text-[14px]">admin_panel_settings</mat-icon>
                <span>Bypass: Super-Admin</span>
              </button>
              
              <button (click)="onLocalDemoBypass('content-editor')"
                      class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-slate-200 hover:text-white text-[11px] font-bold cursor-pointer transition-colors shadow-sm focus:outline-none backdrop-blur-sm">
                <mat-icon class="!w-4 !h-4 !text-[14px] text-slate-400">edit_square</mat-icon>
                <span>Bypass: Editor Only</span>
              </button>
            </div>

            <div class="rounded-xl bg-white/[0.02] px-4 py-3 border border-white/10 text-[10px] text-slate-400 font-mono leading-relaxed backdrop-blur-sm">
              <strong>Security Protocol Whitelist Rules:</strong> only Google Accounts or Whitelisted Users matching 
              <code class="text-indigo-400 font-bold">student.admin&#64;gmail.com</code> or 
              <code class="text-indigo-400 font-bold">aliyusahmad01&#64;gmail.com</code> are whitelisted to perform write operations as Super-Admin in the live database. Use default whitelisted credentials (e.g. email with <code class="text-indigo-450 font-semibold">AdminPassword123!</code>) or the local bypass buttons to perform instant testing.
            </div>

          </div>

        </div>

      </main>


    </div>
  `
})
export class AdminLoginComponent implements OnInit {
  public svc = inject(ScholarshipService);
  private router = inject(Router);

  public errorMessage = signal<string | null>(null);

  public ngOnInit(): void {
    if (this.svc.isAuthorizedAdmin()) {
      this.router.navigate(['/adm']);
    }
  }

  public async onEmailLogin(event: Event, emailInput: HTMLInputElement, passwordInput: HTMLInputElement): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    try {
      await this.svc.loginWithEmailAndPassword(emailInput.value, passwordInput.value);
      if (this.svc.isAuthorizedAdmin()) {
        this.router.navigate(['/adm']);
      } else {
        await this.svc.logout();
        this.errorMessage.set("Authentication verification check failed. This account was denied access.");
      }
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Login failed.');
    }
  }

  public async onGoogleLogin(): Promise<void> {
    this.errorMessage.set(null);
    try {
      await this.svc.loginWithGoogle();
      if (this.svc.isAuthorizedAdmin()) {
        this.router.navigate(['/adm']);
      } else {
        await this.svc.logout();
        this.errorMessage.set("This Google account is not on our pre-authorized Administrator whitelist list. Check security_spec.md.");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg === 'REAL_FIREBASE_NOT_CONFIGURED') {
        this.errorMessage.set("Real state skipped: API keys are not loaded yet in firebase-applet-config.json. Use 'Preview Admin CMS' fallback below.");
      } else {
        this.errorMessage.set("Google authorization popup blocked or skipped by iframe sandbox settings. Use 'Preview Admin CMS' fallback below to test.");
      }
    }
  }

  public onLocalDemoBypass(role: 'super-admin' | 'content-editor'): void {
    this.errorMessage.set(null);
    const mockEmail = role === 'super-admin' ? 'aliyusahmad01@gmail.com' : 'editor.test@gmail.com';
    this.svc.enableLocalDemoAdmin(mockEmail, role);
    this.router.navigate(['/adm']);
  }
}
