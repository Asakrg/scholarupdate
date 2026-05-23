import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { SeoService } from '../services/seo';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, MatIconModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top-level Canvas — Premium Contact Page -->
    <div id="contact-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden z-10">
      
      <!-- Background glowing layers -->
      <div class="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-[-10%] left-[-15%] w-[40rem] h-[40rem] rounded-full bg-purple-500/8 blur-[130px] pointer-events-none -z-10"></div>

      <!-- Header navbar -->
      <app-header />

      <!-- Main Content Container -->
      <main class="flex-grow mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        
        <!-- Hero Header segment -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
            <mat-icon class="!w-3 !h-3 !text-[12px]">contact_support</mat-icon>
            <span>Reach Out</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
            Connect With <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Our Helpdesk</span>
          </h1>
          <p class="text-sm text-slate-400 leading-relaxed">
            Have questions about a listing, crawler logs, advertising options, or feedback? Drop us a line below and our admin team will reply shortly.
          </p>
        </div>

        <!-- Contact Content Split Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Column 1: Info Cards (4/12 grid span) -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="border border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div class="flex items-start gap-4">
                <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <mat-icon class="!w-5 !h-5 !text-[20px]">alternate_email</mat-icon>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white mb-1">Administrative Email</h4>
                  <a href="mailto:admin@ecopulse.app" class="text-xs text-indigo-400 hover:text-indigo-300 font-mono font-bold transition-colors">
                    admin&#64;ecopulse.app
                  </a>
                  <p class="text-[10px] text-slate-500 mt-1">
                    Send direct queries, partnership requests, or security audit notifications.
                  </p>
                </div>
              </div>
            </div>

            <div class="border border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div class="flex items-start gap-4">
                <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <mat-icon class="!w-5 !h-5 !text-[20px]">schedule</mat-icon>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white mb-1">Response Times</h4>
                  <p class="text-xs text-slate-350 leading-relaxed">
                    Within 24 to 48 hours
                  </p>
                  <p class="text-[10px] text-slate-500 mt-1">
                    Our team reviews submissions Monday through Friday during standard business hours.
                  </p>
                </div>
              </div>
            </div>

            <div class="border border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div class="flex items-start gap-4">
                <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <mat-icon class="!w-5 !h-5 !text-[20px]">help_outline</mat-icon>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white mb-1">Self-Service Resources</h4>
                  <p class="text-xs text-slate-350 leading-relaxed">
                    Check our application guides, indexing criteria, and FAQs first.
                  </p>
                  <a routerLink="/resources" class="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-all mt-2">
                    <span>Visit Resource Hub</span>
                    <mat-icon class="!w-3 !h-3 !text-[12px]">arrow_forward</mat-icon>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <!-- Column 2: Interactive Form (7/12 grid span) -->
          <div class="lg:col-span-7">
            
            <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
              
              <!-- Form header -->
              <h3 class="text-lg font-bold text-white mb-2">Send a Message</h3>
              <p class="text-xs text-slate-400 mb-6">
                Fill out the fields below, and our system will route your query to the correct department.
              </p>

              <!-- Success Alert Box -->
              <div *ngIf="submitted()" class="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/35 text-emerald-250 text-xs flex flex-col items-center text-center gap-3 animate-fade-in mb-6">
                <mat-icon class="!w-10 !h-10 !text-[40px] text-emerald-400">check_circle_outline</mat-icon>
                <div>
                  <h4 class="font-bold text-white text-sm mb-1">Message Dispatched Successfully!</h4>
                  <p class="text-slate-400 text-[11px] leading-relaxed">
                    Thank you for reaching out. We have logged your request and sent a confirmation alert to your inbox.
                  </p>
                </div>
                <button (click)="resetForm()" class="px-4 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] transition-colors mt-2 cursor-pointer focus:outline-none">
                  Send Another Message
                </button>
              </div>

              <!-- Contact Form -->
              <form *ngIf="!submitted()" (submit)="onSubmit($event, nameInput, emailInput, subInput, msgInput)" class="space-y-4">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-mono font-semibold text-slate-450 mb-1 uppercase tracking-wider">Your Name</label>
                    <input type="text" #nameInput required placeholder="Alex Mercer"
                           class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono font-semibold text-slate-450 mb-1 uppercase tracking-wider">Email Address</label>
                    <input type="email" #emailInput required placeholder="alex@example.com"
                           class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-mono font-semibold text-slate-450 mb-1 uppercase tracking-wider">Subject Title</label>
                  <input type="text" #subInput required placeholder="Scholarship Directory correction request"
                         class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" />
                </div>

                <div>
                  <label class="block text-[10px] font-mono font-semibold text-slate-450 mb-1 uppercase tracking-wider">Message Details</label>
                  <textarea #msgInput required rows="5" placeholder="Write the details of your message here..."
                            class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"></textarea>
                </div>

                <!-- Submit Button -->
                <button type="submit" [disabled]="loading()"
                        class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 border border-indigo-500/30 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-all cursor-pointer select-none">
                  <mat-icon class="!w-4 !h-4 !text-[15px] animate-spin" *ngIf="loading()">sync</mat-icon>
                  <mat-icon class="!w-4 !h-4 !text-[15px]" *ngIf="!loading()">send</mat-icon>
                  <span>{{ loading() ? 'Sending Message...' : 'Submit Form Message' }}</span>
                </button>

              </form>

            </div>

          </div>

        </div>

      </main>

      <!-- Footer component -->
      <app-footer />
    </div>
  `
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);

  public loading = signal(false);
  public submitted = signal(false);

  public ngOnInit(): void {
    this.seoService.setMetaTags({
      title: 'Contact Us | ScholarshipHub Support',
      description: 'Get in touch with the ScholarshipHub administration team. Send support tickets, directory suggestions, crawler corrections, or partnership requests.',
      keywords: 'contact support, contact scholarshiphub, support email, write to admin'
    });
  }

  public onSubmit(event: Event, nameInput: HTMLInputElement, emailInput: HTMLInputElement, subInput: HTMLInputElement, msgInput: HTMLTextAreaElement): void {
    event.preventDefault();
    if (!nameInput.value || !emailInput.value || !subInput.value || !msgInput.value) return;

    this.loading.set(true);
    
    // Simulate API request dispatch
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  public resetForm(): void {
    this.submitted.set(false);
  }
}
