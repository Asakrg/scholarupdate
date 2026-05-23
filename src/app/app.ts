import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from './services/scholarship';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />

    <!-- Highly-polished Dynamic Floating Toast Portal -->
    <div id="global-toast-container" 
         class="fixed top-6 right-6 z-[999999] flex flex-col gap-3.5 w-[90vw] sm:w-[380px] pointer-events-none select-none">
      @for (toast of svc.toasts(); track toast.id) {
        <div [id]="'toast-card-' + toast.id"
             class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-100 shadow-xl text-neutral-800 transition-all duration-300 animate-slide-in relative overflow-hidden"
             role="alert">
          
          <!-- Subtle top color accent border line instead of gradients -->
          <div class="absolute top-0 left-0 right-0 h-1"
               [class.bg-emerald-500]="toast.type === 'success'"
               [class.bg-rose-500]="toast.type === 'error'"
               [class.bg-amber-500]="toast.type === 'warning'"
               [class.bg-indigo-600]="toast.type === 'info'"></div>

          <!-- Status Icon Wrapper -->
          <div class="flex-shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('success') {
                <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <mat-icon class="!w-4 !h-4 !text-[15px]">check_circle_outline</mat-icon>
                </div>
              }
              @case ('error') {
                <div class="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <mat-icon class="!w-4 !h-4 !text-[15px]">gpp_bad</mat-icon>
                </div>
              }
              @case ('warning') {
                <div class="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <mat-icon class="!w-4 !h-4 !text-[15px]">warning_amber</mat-icon>
                </div>
              }
              @case ('info') {
                <div class="w-6 h-6 rounded-full bg-slate-50 text-indigo-600 flex items-center justify-center">
                  <mat-icon class="!w-4 !h-4 !text-[15px]">info_outline</mat-icon>
                </div>
              }
            }
          </div>

          <!-- Notification text fields -->
          <div class="flex-1 min-w-0 pr-1">
            <h4 class="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider select-none leading-none pt-0.5">
              {{ toast.title }}
            </h4>
            <p class="text-[11px] font-sans text-neutral-500 mt-1 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <!-- Direct manual dismiss trigger button -->
          <button (click)="svc.dismissToast(toast.id)"
                  id="btn-close-toast"
                  class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close alert">
            <mat-icon class="!w-4 !h-4 !text-[14px]">close</mat-icon>
          </button>

        </div>
      }
    </div>
  `
})
export class AppComponent implements OnInit {
  public svc = inject(ScholarshipService);
  private router = inject(Router);

  public ngOnInit(): void {
    // Listen to successfully finalized routing routes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Exclude administrative dashboard panel movements
      if (!event.urlAfterRedirects.startsWith('/adm')) {
        this.svc.trackPageView();
      }
    });
  }
}
