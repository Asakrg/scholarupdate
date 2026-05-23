import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-redirection-modal',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showModal) {
      <div id="redirection-confirmation-overlay" 
           class="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-350 animate-fade-in pointer-events-auto">
        
        <!-- Frosted dialog wrapper -->
        <div class="bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_50px_rgba(0,0,0,0.8)] rounded-2xl max-w-md w-full overflow-hidden flex flex-col transition-all transform animate-slide-in text-white">
          
          <!-- Security Header Flag (Frosted Indigo) -->
          <div class="bg-indigo-950/40 text-white px-5 py-4 flex items-center gap-2.5 select-none relative border-b border-white/10 backdrop-blur-xl">
            <div class="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
            <mat-icon class="!w-5 !h-5 !text-[20px] text-emerald-400">security</mat-icon>
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">Official Redirection Handshake</span>
          </div>

          <div class="p-6 space-y-4">
            <div class="space-y-1">
              <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest leading-normal">
                Transferring To External Portal
              </h3>
              <p class="text-[11.5px] font-sans text-slate-400 leading-normal">
                You are about to exit ScholarshipHub to access the verified registration form on the partner institution's gateway:
              </p>
            </div>

            <!-- Redirection Target Link Box -->
            <div class="p-3 bg-slate-900/60 border border-white/10 rounded-xl font-mono text-[10px] text-slate-300 select-all break-all leading-normal flex items-start gap-2 backdrop-blur-xl">
              <mat-icon class="!w-3.5 !h-3.5 !text-[14px] text-slate-400 mt-0.5 flex-shrink-0">link</mat-icon>
              <span>{{ redirectUrl }}</span>
            </div>

            <!-- Handoff Safety Notices -->
            <div class="space-y-3 pt-1 select-none">
              <div class="flex items-start gap-2">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-indigo-400 mt-0.5 flex-shrink-0">offline_pin</mat-icon>
                <p class="text-[10px] font-sans text-slate-400 leading-normal">
                  <strong>Zero Registry Fees</strong>: Official fully funded opportunities are completely free. Never disclose private transaction cards or pay third-party agents.
                </p>
              </div>
              <div class="flex items-start gap-2">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-rose-500 mt-0.5 flex-shrink-0">watch_later</mat-icon>
                <p class="text-[10px] font-sans text-slate-400 leading-normal">
                  Please submit your materials prior to the official deadline of <strong class="text-rose-400 font-mono text-[10.5px] font-bold">{{ deadline | date:'longDate' }}</strong>.
                </p>
              </div>
            </div>
          </div>

          <!-- Dialog Decision Buttons Grid (Frosted) -->
          <div class="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10 font-sans text-xs bg-white/[0.01]">
            <button (click)="onCancel()"
                    class="py-4 font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-center select-none outline-none">
              Cancel Redirection
            </button>
            <a [href]="redirectUrl" target="_blank" rel="noopener noreferrer"
               (click)="onProceed()"
               class="py-4 font-bold text-indigo-400 hover:bg-white/5 hover:text-indigo-300 text-center select-none flex items-center justify-center gap-1.5 cursor-pointer outline-none">
              <span>Proceed to Portal</span>
              <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">logout</mat-icon>
            </a>
          </div>

        </div>

      </div>
    }
  `
})
export class RedirectionModalComponent {
  @Input() showModal: boolean = false;
  @Input() redirectUrl: string = '';
  @Input() deadline?: string;

  @Output() cancel = new EventEmitter<void>();
  @Output() proceed = new EventEmitter<void>();

  public onCancel(): void {
    this.cancel.emit();
  }

  public onProceed(): void {
    this.proceed.emit();
  }
}
