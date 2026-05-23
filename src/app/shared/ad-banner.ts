import { Component, Input, OnInit, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService } from '../services/scholarship';

@Component({
  selector: 'app-ad-banner',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeProvider) {
      <div [class]="containerClass" (mouseenter)="isMouseOverAd = true" (mouseleave)="isMouseOverAd = false">
        @if (isLoading()) {
          <!-- Skeleton Loader -->
          <div class="animate-pulse flex flex-col justify-between h-full w-full p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="h-2 w-16 bg-white/10 rounded"></div>
              <div class="h-3 w-16 bg-white/10 rounded"></div>
            </div>
            <div class="space-y-2 flex-grow">
              <div class="h-4 bg-white/10 rounded w-3/4"></div>
              <div class="h-3 bg-white/10 rounded w-5/6"></div>
            </div>
            <div class="h-8 bg-white/10 rounded-xl w-28 mt-4"></div>
          </div>
        } @else {
          <!-- Active Premium Ad Content -->
          @if (useProductionAds()) {
            <!-- Real production-injected ad container -->
            <div class="relative w-full h-full min-h-[inherit] flex items-center justify-center p-2 bg-slate-950/60 rounded-2xl" #adContainer>
              <!-- Scripts or adsbygoogle will be appended here -->
            </div>
          } @else {
            <!-- Fallback Mockup Campaigns -->
            <div class="relative h-full w-full p-6 flex flex-col justify-between overflow-hidden">
              <!-- Background glow decoration -->
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
              
              <!-- Ad Header Badge -->
              <div class="flex items-center justify-between z-10 select-none">
                <span class="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">SPONSORED</span>
                <span class="px-2 py-0.5 text-[8px] font-mono font-bold rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  AD BY {{ activeProvider.name | uppercase }}
                </span>
              </div>

              <!-- Ad Content based on placement -->
              <div class="my-4 z-10 flex-grow flex flex-col justify-center">
                @if (placement === 'leaderboard') {
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="space-y-1">
                      <h4 class="text-sm font-display font-bold text-white tracking-tight">
                        {{ adData.title }}
                      </h4>
                      <p class="text-xs text-slate-400">
                        {{ adData.desc }}
                      </p>
                    </div>
                    <a [href]="adData.ctaUrl" target="_blank"
                       class="inline-flex items-center justify-center shrink-0 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all">
                      {{ adData.ctaText }}
                    </a>
                  </div>
                } @else {
                  <div class="space-y-2">
                    <h4 class="text-md font-display font-extrabold text-white leading-snug tracking-tight">
                      {{ adData.title }}
                    </h4>
                    <p class="text-xs text-slate-355 leading-relaxed">
                      {{ adData.desc }}
                    </p>
                  </div>
                }
              </div>

              <!-- Ad Footer / Action for non-leaderboard -->
              @if (placement !== 'leaderboard') {
                <div class="z-10 mt-4">
                  <a [href]="adData.ctaUrl" target="_blank"
                     class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all border border-indigo-500/30">
                    <span>{{ adData.ctaText }}</span>
                    <mat-icon class="!w-3 !h-3 !text-[12px]">open_in_new</mat-icon>
                  </a>
                </div>
              }
            </div>
          }
        }
      </div>
    }
  `
})
export class AdBannerComponent implements OnInit {
  public svc = inject(ScholarshipService);
  
  @Input() placement!: 'leaderboard' | 'sidebar' | 'inFeed';
  @ViewChild('adContainer', { static: false }) adContainerRef?: ElementRef;
  
  public isLoading = signal(true);
  public useProductionAds = signal(false);
  public isMouseOverAd = false;

  @HostListener('window:blur')
  onWindowBlur(): void {
    if (this.isMouseOverAd && this.activeProvider) {
      this.svc.trackAdClick();
    }
  }

  public ngOnInit(): void {
    // Track ad impression if provider is active
    const provider = this.activeProvider;
    if (provider) {
      this.svc.trackAdImpression();
    }
    // Check if provider is enabled and credentials are valid
    if (provider && provider.credentials) {
      const hasCreds = (provider.id === 'adsense' && provider.credentials.publisherId && provider.credentials.slotId) ||
                       (provider.id === 'adsterra' && provider.credentials.bannerId) ||
                       (provider.id === 'ezoic' && provider.credentials.siteId) ||
                       (provider.id === 'mediavine' && provider.credentials.siteId);

      if (hasCreds) {
        this.useProductionAds.set(true);
        this.isLoading.set(false);
        // Inject script after rendering completes
        setTimeout(() => {
          this.injectProductionAd(provider);
        }, 150);
        return;
      }
    }

    // Simulated loading time to mimic server ad auctions for mockups
    setTimeout(() => {
      this.isLoading.set(false);
    }, 850);
  }

  // Inject production scripts or custom layouts dynamically
  private injectProductionAd(provider: any): void {
    const container = this.adContainerRef?.nativeElement;
    if (!container) return;

    if (provider.id === 'adsense') {
      const pubId = provider.credentials.publisherId;
      const slotId = provider.credentials.slotId;

      try {
        // Load global script if not already loaded
        if (!document.querySelector('script[src*="adsbygoogle"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
          script.crossOrigin = 'anonymous';
          script.onerror = () => {
            console.warn('AdSense script blocked or failed. Falling back to mockup.');
            this.useProductionAds.set(false);
          };
          document.head.appendChild(script);
        }

        // Build ins element
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.width = '100%';
        ins.style.height = '100%';
        ins.setAttribute('data-ad-client', pubId);
        ins.setAttribute('data-ad-slot', slotId);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');

        container.appendChild(ins);

        // Push ad
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense injection failed, falling back:', err);
        this.useProductionAds.set(false);
      }
    } else if (provider.id === 'adsterra') {
      const bannerId = provider.credentials.bannerId;
      
      try {
        const height = this.placement === 'leaderboard' ? 90 : (this.placement === 'sidebar' ? 250 : 300);
        const width = this.placement === 'leaderboard' ? 728 : (this.placement === 'sidebar' ? 300 : 300);

        (window as any).atOptions = {
          'key': bannerId,
          'format': 'iframe',
          'height': height,
          'width': width,
          'params': {}
        };

        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.text = `atOptions = ${JSON.stringify((window as any).atOptions)};`;
        container.appendChild(confScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `//www.highperformanceformat.com/${bannerId}/invoke.js`;
        invokeScript.onerror = () => {
          console.warn('Adsterra script blocked or failed. Falling back to mockup.');
          this.useProductionAds.set(false);
        };
        container.appendChild(invokeScript);
      } catch (err) {
        console.warn('Adsterra injection failed, falling back:', err);
        this.useProductionAds.set(false);
      }
    } else {
      // Ezoic or Mediavine placeholders
      const siteId = provider.credentials.siteId || '';
      const div = document.createElement('div');
      div.className = 'text-center p-4 border border-indigo-500/20 bg-slate-900/60 rounded-xl w-full';
      div.innerHTML = `
        <span class="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest block mb-1">PROD INTEGRATION ACTIVE</span>
        <div class="text-xs font-semibold text-slate-355">${provider.name} Container (Site ID: ${siteId})</div>
        <div class="text-[10px] text-slate-400 mt-1 font-mono">Dynamic placement [${this.placement}] active. Scripts registered.</div>
      `;
      container.appendChild(div);
    }
  }

  // Get active provider details
  public get activeProvider() {
    const providers = this.svc.adProviders();
    const active = providers.find(p => p.enabled);
    if (!active) return null;
    
    // Check if current placement configuration is enabled
    if (active.placements[this.placement]) {
      return active;
    }
    return null;
  }

  // Set design class based on container requirements
  public get containerClass(): string {
    const base = "border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/15 ";
    if (this.placement === 'leaderboard') {
      return base + "w-full mb-8 min-h-[90px]";
    } else if (this.placement === 'sidebar') {
      return base + "w-full min-h-[220px]";
    } else {
      // inFeed card matches standard scholarship card sizing/height
      return base + "w-full h-full min-h-[350px] flex flex-col justify-between";
    }
  }

  // Premium Sponsored Campaign Copy
  public get adData() {
    const provider = this.activeProvider;
    if (!provider) return { title: '', desc: '', ctaText: '', ctaUrl: '' };

    if (provider.id === 'adsense') {
      return {
        title: 'Accelerate Your Thesis with Grammarly Premium',
        desc: 'Review grammar, syntax, tone, and plagiarisms instantly. Write winning scholarship applications.',
        ctaText: 'Enhance Your Writing',
        ctaUrl: 'https://grammarly.com'
      };
    } else if (provider.id === 'ezoic') {
      return {
        title: 'Unlock 7.5+ Bands on IELTS/TOEFL Exams',
        desc: 'Join the industry-leading test prep course. Practice with mock tests, vocabulary sheets, and real tutors.',
        ctaText: 'Prepare Now',
        ctaUrl: 'https://magoosh.com'
      };
    } else if (provider.id === 'mediavine') {
      return {
        title: 'Safe Student Accommodations Worldwide',
        desc: 'Book verified student halls, shared apartments, or private studios near major top universities.',
        ctaText: 'Find Your Room',
        ctaUrl: 'https://student.com'
      };
    } else {
      return {
        title: 'Fast Track Your Global Tech Career',
        desc: 'Gain accredited online engineering certificates from Google, IBM, and top global colleges.',
        ctaText: 'Learn on Coursera',
        ctaUrl: 'https://coursera.org'
      };
    }
  }
}
