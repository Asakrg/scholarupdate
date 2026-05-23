import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { SeoService } from '../services/seo';

@Component({
  selector: 'app-privacy',
  imports: [CommonModule, MatIconModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top-level Canvas — Premium Privacy Policy Page -->
    <div id="privacy-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden z-10">
      
      <!-- Glowing background orbs -->
      <div class="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-15%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/8 blur-[130px] pointer-events-none -z-10"></div>

      <!-- Header navbar -->
      <app-header />

      <!-- Main Content Container -->
      <main class="flex-grow mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        
        <!-- Hero Title block -->
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
            <mat-icon class="!w-3 !h-3 !text-[12px]">security</mat-icon>
            <span>Legal Policy</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p class="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            Last Updated: May 23, 2026
          </p>
        </div>

        <!-- Privacy Terms Document Card (Glassmorphic) -->
        <div class="border border-white/10 bg-slate-950/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          
          <div class="prose prose-invert prose-xs max-w-none text-slate-300 space-y-8 font-sans leading-relaxed">
            
            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">1.</span>
                <span>Introduction & Scope</span>
              </h2>
              <p class="text-xs text-slate-400">
                Welcome to ScholarshipHub (accessible at <a href="/" class="text-indigo-400 hover:text-indigo-305 underline">https://scholarshiphub.com</a>). Your privacy is of paramount importance to us. This Privacy Policy document outlines the types of personal and anonymous data we collect, store, and process when you navigate our directory or subscribe to our newsletter feeds.
              </p>
            </div>

            <hr class="border-white/5" />

            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">2.</span>
                <span>Information We Collect</span>
              </h2>
              <p class="text-xs text-slate-400 mb-3">
                We collect information in two main categories to ensure the search directory operates with high efficiency:
              </p>
              <ul class="list-disc pl-5 text-xs text-slate-450 space-y-2">
                <li>
                  <strong class="text-slate-300">Newsletter Subscription Emails:</strong> When you subscribe to our Priority Alert newsletter, we collect and store your email address in our secure subscriber database to deliver automated alerts when new academic opportunities are indexed.
                </li>
                <li>
                  <strong class="text-slate-300">Browser Metrics (Cookies & LocalStorage):</strong> We store your UI theme preference (dark/light mode) and cache local search query logs within your browser's local storage buffer to accelerate load speeds.
                </li>
              </ul>
            </div>

            <hr class="border-white/5" />

            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">3.</span>
                <span>Data Retention & Deletion</span>
              </h2>
              <p class="text-xs text-slate-400">
                We store your subscription email address indefinitely as long as your subscription is active. You may unsubscribe or request permanent removal of your email from our list at any time. Simply click the "Unsubscribe" link in any alert email or contact our support inbox directly.
              </p>
            </div>

            <hr class="border-white/5" />

            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">4.</span>
                <span>Third-Party Links & API Processing</span>
              </h2>
              <p class="text-xs text-slate-400">
                Our database indexes scholarship details but redirects applications to the official academic partner portals (universities or foundations). Once you click an application gateway and exit our site, you are subject to the third-party's privacy policies. We encourage you to review their terms before disclosing sensitive academic or personal documentation.
              </p>
            </div>

            <hr class="border-white/5" />

            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">5.</span>
                <span>Security Infrastructure</span>
              </h2>
              <p class="text-xs text-slate-400">
                All network connections to our directory are encrypted using standard SSL/TLS channels. Our database layers enforce zero-trust security profiles. Security credentials and administrator permissions are kept locked behind verified authentication schemes.
              </p>
            </div>

            <hr class="border-white/5" />

            <div>
              <h2 class="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                <span class="text-indigo-400 font-bold">6.</span>
                <span>Contact and Questions</span>
              </h2>
              <p class="text-xs text-slate-400">
                If you have any questions, compliance queries, or concerns regarding this policy, please reach out to us at:
              </p>
              <div class="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 inline-block">
                <span class="text-[10px] font-mono text-slate-500 uppercase block mb-1">Privacy Officer Contact</span>
                <a href="mailto:admin@ecopulse.app" class="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  admin&#64;ecopulse.app
                </a>
              </div>
            </div>

          </div>

        </div>

      </main>

      <!-- Footer component -->
      <app-footer />
    </div>
  `
})
export class PrivacyComponent implements OnInit {
  private seoService = inject(SeoService);

  public ngOnInit(): void {
    this.seoService.setMetaTags({
      title: 'Privacy Policy | ScholarshipHub',
      description: 'Review our Privacy Policy. Understand how ScholarshipHub collects, processes, and protects your email data and local browser preference settings.',
      keywords: 'privacy policy, gdpr compliance, data security, email handling'
    });
  }
}
