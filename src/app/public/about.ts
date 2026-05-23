import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { SeoService } from '../services/seo';

@Component({
  selector: 'app-about',
  imports: [CommonModule, MatIconModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top-level Canvas — Premium About Us Page -->
    <div id="about-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden z-10">
      
      <!-- Layered glowing background layers -->
      <div class="absolute top-[-10%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/8 blur-[130px] pointer-events-none -z-10"></div>

      <!-- Header navbar -->
      <app-header />

      <!-- Main Content Container -->
      <main class="flex-grow mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        
        <!-- Hero Header segment -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
            <mat-icon class="!w-3 !h-3 !text-[12px]">info</mat-icon>
            <span>Our Narrative</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
            Democratizing <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Global Education</span> Funding
          </h1>
          <p class="text-sm text-slate-400 leading-relaxed">
            ScholarshipHub is a state-of-the-art open index tracking verified fully-funded scholarships, prestigious fellowships, and research grants. We help connect global talent with world-renowned academic institutions.
          </p>
        </div>

        <!-- Vision and Mission Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div class="border border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden shadow-md">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-5">
              <mat-icon class="!w-5 !h-5 !text-[20px]">visibility</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Our Vision</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              We envision a world where higher education funding is transparent, searchable, and accessible to everyone. Financial constraints should never act as a barrier to global academic excellence.
            </p>
          </div>

          <div class="border border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden shadow-md">
            <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
              <mat-icon class="!w-5 !h-5 !text-[20px]">ads_click</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Our Mission</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              To aggregate premium academic scholarship funding opportunities under a unified, intuitive platform. We eliminate dark-patterns and paywalls, providing direct links to official program applications.
            </p>
          </div>
        </div>

        <!-- Platform Pillars Grid -->
        <div class="mb-16">
          <h2 class="text-xl sm:text-2xl font-display font-black text-white tracking-tight mb-8 text-center">
            The Core Pillars of Our Portal
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div class="border border-white/8 bg-white/[0.02] rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
              <div class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
                <mat-icon class="!w-4 !h-4 !text-[16px]">verified</mat-icon>
              </div>
              <h4 class="text-sm font-semibold text-white mb-2">100% Verified Curation</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Every scholarship listed in our matrix is manually vetted and linked directly to the host university or partner foundation.
              </p>
            </div>

            <div class="border border-white/8 bg-white/[0.02] rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
              <div class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-4">
                <mat-icon class="!w-4 !h-4 !text-[16px]">bolt</mat-icon>
              </div>
              <h4 class="text-sm font-semibold text-white mb-2">Automated Discovery</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Our active web scraping engine updates local database pipelines daily, catching deadline shifts and fresh application openings.
              </p>
            </div>

            <div class="border border-white/8 bg-white/[0.02] rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
              <div class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-4">
                <mat-icon class="!w-4 !h-4 !text-[16px]">campaign</mat-icon>
              </div>
              <h4 class="text-sm font-semibold text-white mb-2">Equal Opportunity</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                We design specialized feeds focusing on international candidates, underrepresented demographic groups, and fully-funded grants.
              </p>
            </div>

          </div>
        </div>

        <!-- Team Showcase Section -->
        <div>
          <h2 class="text-xl sm:text-2xl font-display font-black text-white tracking-tight mb-4 text-center">
            Meet the Advisory Team
          </h2>
          <p class="text-xs text-slate-400 text-center max-w-xl mx-auto mb-10">
            A diverse collective of researchers, web engineers, and academic consultants striving to make scholarship acquisition easier.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            <div class="border border-white/10 bg-slate-900/40 rounded-3xl p-6 text-center">
              <div class="w-16 h-16 rounded-full border border-indigo-500/30 bg-indigo-950/80 mx-auto flex items-center justify-center mb-4">
                <mat-icon class="!w-8 !h-8 !text-[32px] text-indigo-400">person</mat-icon>
              </div>
              <h4 class="text-sm font-bold text-white leading-tight">Dr. Elena Rostova</h4>
              <span class="text-[9px] font-mono text-indigo-400 uppercase font-semibold">Chief Academic Consultant</span>
              <p class="text-[11px] text-slate-400 leading-relaxed mt-3">
                Former university dean specializing in graduate fellowship evaluations and international program relations.
              </p>
            </div>

            <div class="border border-white/10 bg-slate-900/40 rounded-3xl p-6 text-center">
              <div class="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-950/80 mx-auto flex items-center justify-center mb-4">
                <mat-icon class="!w-8 !h-8 !text-[32px] text-emerald-400">person</mat-icon>
              </div>
              <h4 class="text-sm font-bold text-white leading-tight">Marcus Vance</h4>
              <span class="text-[9px] font-mono text-emerald-400 uppercase font-semibold">Lead Crawl Architect</span>
              <p class="text-[11px] text-slate-400 leading-relaxed mt-3">
                Full-stack dev focusing on web scraping automation, search indexes, and data validation pipelines.
              </p>
            </div>

            <div class="border border-white/10 bg-slate-900/40 rounded-3xl p-6 text-center">
              <div class="w-16 h-16 rounded-full border border-purple-500/30 bg-purple-950/80 mx-auto flex items-center justify-center mb-4">
                <mat-icon class="!w-8 !h-8 !text-[32px] text-purple-400">person</mat-icon>
              </div>
              <h4 class="text-sm font-bold text-white leading-tight">Sarah Jenkins</h4>
              <span class="text-[9px] font-mono text-purple-400 uppercase font-semibold">Global Outreach Liaison</span>
              <p class="text-[11px] text-slate-400 leading-relaxed mt-3">
                Advocates equal access across international student bodies and manages university partnerships.
              </p>
            </div>

          </div>
        </div>

      </main>

      <!-- Footer component -->
      <app-footer />
    </div>
  `
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  public ngOnInit(): void {
    this.seoService.setMetaTags({
      title: 'About Us | ScholarshipHub',
      description: 'Learn about ScholarshipHub, our vision, our mission, and our efforts to democratize global higher education scholarship and research funding.',
      keywords: 'about scholarshiphub, scholarship search engine, academic mission, verified scholarships'
    });
  }
}
