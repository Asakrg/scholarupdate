import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../../services/scholarship';

@Component({
  selector: 'app-newsletter-cta',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Newsletter CTA — Dedicated Subscription Section -->
    <section class="mb-16 sm:mb-20">
      <div class="frost-heavy rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
        
        <!-- Glow orbs -->
        <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-emerald-500/8 blur-[60px] pointer-events-none"></div>
        
        <!-- Top accent line -->
        <div class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>

        <div class="relative z-10">
          <mat-icon class="!w-10 !h-10 !text-[40px] text-indigo-400 mb-4">notifications_active</mat-icon>
          
          <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-3">Never Miss a Deadline Again</h2>
          <p class="text-sm text-slate-400 font-sans max-w-lg mx-auto mb-6">
            Join 14,000+ scholars receiving weekly curated alerts for scholarships matching their profile.
          </p>

          <!-- Feature chips -->
          <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span class="flex items-center gap-1.5 text-xs text-slate-300 frost-light rounded-full px-3 py-1.5">
              <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-emerald-400">check_circle</mat-icon>
              Personalized Matches
            </span>
            <span class="flex items-center gap-1.5 text-xs text-slate-300 frost-light rounded-full px-3 py-1.5">
              <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-emerald-400">check_circle</mat-icon>
              Deadline Reminders
            </span>
            <span class="flex items-center gap-1.5 text-xs text-slate-300 frost-light rounded-full px-3 py-1.5">
              <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-emerald-400">check_circle</mat-icon>
              Insider Tips
            </span>
          </div>

          <!-- Email Input -->
          <div class="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto mb-4">
            <input type="email" #emailInput
                   placeholder="Enter your email address"
                   (keydown.enter)="onSubscribe(emailInput.value); emailInput.value = ''"
                   class="flex-1 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/30 backdrop-blur-sm transition-all" />
            <button (click)="onSubscribe(emailInput.value); emailInput.value = ''"
                    [disabled]="isSubmitting()"
                    class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
              {{ isSubmitting() ? 'Subscribing...' : 'Subscribe Free' }}
            </button>
          </div>

          <!-- Status message -->
          @if (statusMessage()) {
            <div [class]="'text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ' + 
                          (isError() ? 'bg-rose-950/50 text-rose-400 border border-rose-500/20' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20')">
              <mat-icon class="!w-3.5 !h-3.5 !text-[12px]">{{ isError() ? 'error_outline' : 'check_circle' }}</mat-icon>
              <span>{{ statusMessage() }}</span>
            </div>
          }

          <!-- Privacy note -->
          <p class="text-[10px] text-slate-500 font-mono mt-4">No spam. Unsubscribe anytime. Your data is never shared.</p>
        </div>
      </div>
    </section>
  `
})
export class NewsletterCtaComponent {
  private svc = inject(ScholarshipService);

  public statusMessage = signal<string | null>(null);
  public isError = signal(false);
  public isSubmitting = signal(false);

  public async onSubscribe(email: string): Promise<void> {
    this.statusMessage.set(null);
    this.isError.set(false);

    const val = email ? email.trim() : '';
    if (!val) {
      this.isError.set(true);
      this.statusMessage.set('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      this.isError.set(true);
      this.statusMessage.set('Please enter a valid email address.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await this.svc.subscribeEmail(val);
      this.isError.set(false);
      this.statusMessage.set('Welcome aboard! You\'ll receive your first alert soon.');
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(err.message || String(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
