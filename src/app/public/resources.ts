import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Resource } from '../services/scholarship';
import { SeoService } from '../services/seo';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { AdBannerComponent } from '../shared/ad-banner';

@Component({
  selector: 'app-resources',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
    AdBannerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top-level Canvas — Premium Glassmorphism Resources Directory -->
    <div id="resources-directory-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden z-10">
      
      <!-- Glow background orbs -->
      <div class="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-indigo-500/10 blur-[180px] pointer-events-none -z-10 orb-drift-1"></div>
      <div class="absolute top-[30%] right-[-15%] w-[45rem] h-[45rem] rounded-full bg-emerald-500/8 blur-[160px] pointer-events-none -z-10 orb-drift-2"></div>
      <div class="absolute bottom-[-15%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-violet-500/5 blur-[150px] pointer-events-none -z-10 orb-drift-3"></div>

      <!-- Header -->
      <app-header />

      <!-- Main Container -->
      <main class="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        @if (selectedResource()) {
          <!-- DETAIL VIEW -->
          <div class="max-w-4xl mx-auto">
            <!-- Back Action -->
            <button (click)="goBack()" 
                    class="group inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs transition-all cursor-pointer">
              <mat-icon class="!w-4 !h-4 !text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</mat-icon>
              <span>Back to Resources</span>
            </button>

            <!-- Main glass card detail -->
            <div class="frost-heavy rounded-2xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
              <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              <!-- Metadata -->
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span [class]="getCategoryClass(selectedResource()?.category || 'Guide')">
                  {{ selectedResource()?.category }}
                </span>
                <span class="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <mat-icon class="!w-3 !h-3 !text-[12px]">calendar_today</mat-icon>
                  {{ formatDate(selectedResource()?.publishedAt) }}
                </span>
                <span class="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <mat-icon class="!w-3 !h-3 !text-[12px]">visibility</mat-icon>
                  {{ selectedResource()?.views || 0 }} reads
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight mb-4">
                {{ selectedResource()?.title }}
              </h1>

              <!-- Excerpt block quote -->
              <p class="text-sm font-sans font-medium text-indigo-200/90 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-xl p-4 mb-8 leading-relaxed">
                {{ selectedResource()?.excerpt }}
              </p>

              <!-- Main Markdown Content Rendered -->
              <div class="markdown-body text-slate-300 text-xs sm:text-sm leading-relaxed" 
                   [innerHTML]="htmlContent()">
              </div>

              <!-- Share guide footer section -->
              <div class="border-t border-white/8 mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-semibold text-slate-400">Share this Guide:</span>
                  <div class="flex gap-2">
                    <button (click)="copyLink()" 
                            class="p-2 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/8 text-slate-400 hover:text-white transition-all cursor-pointer relative"
                            title="Copy link to clipboard">
                      <mat-icon class="!w-4 !h-4 !text-[16px]">{{ linkCopied() ? 'check' : 'link' }}</mat-icon>
                    </button>
                    <a [href]="getTwitterShareUrl()" target="_blank"
                       class="p-2 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/8 text-slate-400 hover:text-indigo-400 transition-all">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono text-slate-500">Need personal support? Reach out in public forums.</span>
                </div>
              </div>

            </div>

            <!-- Ad placement -->
            @if (isAdActive('leaderboard')) {
              <div class="mt-8">
                <app-ad-banner placement="leaderboard" />
              </div>
            }

          </div>
        } @else {
          <!-- LIST VIEW -->
          <div class="space-y-8">
            
            <!-- Hero Heading block -->
            <div class="text-center max-w-3xl mx-auto mb-10">
              <h1 class="text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-3">
                Applicant <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Resource Hub</span>
              </h1>
              <p class="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                Empowering international applicants with expert scholarship guides, application strategies, writing tips, and academic funding FAQs.
              </p>
            </div>

            <!-- Search and category filters -->
            <div class="frost-light border border-white/10 rounded-2xl p-4 sm:p-6 max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <!-- Search box -->
              <div class="relative flex-grow max-w-xl">
                <mat-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 !w-5 !h-5 !text-[20px]">search</mat-icon>
                <input type="text"
                       [value]="searchQuery()"
                       (input)="onSearchInput($event)"
                       placeholder="Search resources, tips, and guides..."
                       class="w-full bg-slate-900/60 border border-white/8 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans" />
                <button *ngIf="searchQuery()" 
                        (click)="clearSearch()" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none">
                  <mat-icon class="!w-4 !h-4 !text-[16px]">close</mat-icon>
                </button>
              </div>

              <!-- Category tabs -->
              <div class="flex flex-wrap items-center gap-1.5 shrink-0 bg-white/[0.02] border border-white/5 rounded-xl p-1">
                @for (cat of categories; track cat) {
                  <button (click)="selectCategory(cat)"
                          [class]="'px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ' + 
                                   (activeCategory() === cat 
                                     ? 'bg-indigo-600 border border-indigo-500/30 text-white shadow-lg shadow-indigo-600/20' 
                                     : 'text-slate-400 hover:text-white hover:bg-white/[0.04]')">
                    {{ cat === 'All' ? 'All Resources' : cat + 's' }}
                  </button>
                }
              </div>

            </div>

            <!-- Guides Grid / Directory -->
            <div class="max-w-5xl mx-auto">
              @if (filteredResources().length === 0) {
                <div class="text-center py-16 frost-heavy border border-white/8 rounded-2xl max-w-md mx-auto p-8">
                  <mat-icon class="!w-10 !h-10 !text-[44px] text-slate-500 mb-3">auto_stories</mat-icon>
                  <h3 class="font-display font-bold text-sm text-white mb-1">No Resources Found</h3>
                  <p class="text-xs text-slate-400 mb-4 font-sans">We couldn't find any resources matching your search queries or selected category.</p>
                  <button (click)="resetFilters()"
                          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all border border-indigo-500/20 shadow-md">
                    Reset Filters
                  </button>
                </div>
              } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (res of filteredResources(); track res.id; let i = $index) {
                    <!-- Card item -->
                    <div [routerLink]="['/resources', res.id]"
                         class="group cursor-pointer frost-light border border-white/8 hover:border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                      
                      <!-- Top gradient highlight -->
                      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/25 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div>
                        <!-- Category & Views -->
                        <div class="flex items-center justify-between gap-2 mb-3">
                          <span [class]="getCategoryClass(res.category)">
                            {{ res.category }}
                          </span>
                          <span class="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <mat-icon class="!w-3 !h-3 !text-[11px]">visibility</mat-icon>
                            {{ res.views || 0 }} reads
                          </span>
                        </div>

                        <!-- Title -->
                        <h3 class="font-display font-bold text-sm text-white tracking-tight group-hover:text-indigo-400 transition-all mb-2 leading-snug">
                          {{ res.title }}
                        </h3>

                        <!-- Excerpt -->
                        <p class="text-xs font-sans text-slate-400 line-clamp-3 leading-relaxed mb-6">
                          {{ res.excerpt }}
                        </p>
                      </div>

                      <!-- Footer/Link -->
                      <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                        <span class="text-[9px] font-mono text-slate-500">
                          {{ formatDate(res.publishedAt) }}
                        </span>
                        <span class="text-[10px] font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-all">
                          <span>Read Guide</span>
                          <mat-icon class="!w-3 !h-3 !text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</mat-icon>
                        </span>
                      </div>

                    </div>

                    <!-- Inject ad-banner inside feed if Ezoic/AdSense is ready -->
                    @if (i === 2 && isAdActive('inFeed')) {
                      <div class="col-span-full py-4">
                        <app-ad-banner placement="inFeed" />
                      </div>
                    }
                  }
                </div>
              }
            </div>

          </div>
        }

      </main>

      <!-- Footer -->
      <app-footer />

    </div>
  `,
  styles: [`
    .markdown-body ::ng-deep h2 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.25rem;
    }
    .markdown-body ::ng-deep h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #818cf8;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .markdown-body ::ng-deep li {
      font-size: 0.825rem;
      color: #cbd5e1;
      margin-left: 1rem;
      margin-bottom: 0.375rem;
      list-style-type: disc;
    }
    .markdown-body ::ng-deep strong {
      font-weight: 700;
      color: #ffffff;
    }
    .markdown-body ::ng-deep p {
      margin-bottom: 0.75rem;
    }
    .markdown-body ::ng-deep div.q-block {
      color: #a5b4fc;
      font-weight: 700;
      margin-top: 1rem;
      margin-bottom: 0.25rem;
    }
    .markdown-body ::ng-deep div.a-block {
      color: #cbd5e1;
      padding-left: 0.75rem;
      border-left: 2px solid rgba(129, 140, 248, 0.3);
      margin-bottom: 1rem;
    }
  `]
})
export class ResourcesComponent implements OnInit {
  public svc = inject(ScholarshipService);
  public seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public categories = ['All', 'Guide', 'Tip', 'FAQ'];
  public activeCategory = signal<string>('All');
  public searchQuery = signal<string>('');
  
  public selectedResource = signal<Resource | null>(null);
  public currentId = signal<string | null>(null);
  public linkCopied = signal<boolean>(false);
  private lastViewedId: string | null = null;

  public isAdActive(placement: 'leaderboard' | 'sidebar' | 'inFeed'): boolean {
    const active = this.svc.adProviders().find(p => p.enabled);
    return !!(active && active.placements[placement]);
  }

  constructor() {
    effect(() => {
      const id = this.currentId();
      const resourcesList = this.svc.resources();
      const isLoaded = this.svc.isStateLoaded();
      if (id) {
        const match = resourcesList.find(r => r.id === id);
        if (match) {
          if (match.status === 'published') {
            this.selectedResource.set(match);
            if (this.lastViewedId !== id) {
              this.lastViewedId = id;
              this.svc.incrementResourceViews(id);
            }
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            this.router.navigate(['/resources'], { replaceUrl: true });
          }
        } else if (isLoaded) {
          // If resources are loaded but this specific ID doesn't exist
          this.router.navigate(['/resources'], { replaceUrl: true });
        }
      } else {
        this.selectedResource.set(null);
        this.lastViewedId = null;
      }
    });

    effect(() => {
      const res = this.selectedResource();
      if (res) {
        this.seo.setMetaTags({
          title: `${res.title} | ScholarshipHub Guides`,
          description: res.excerpt || 'Read applicant resources and scholarship guidelines.',
          type: 'article',
          ogImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
          ogUrl: typeof window !== 'undefined' ? window.location.href : `https://scholarshiphub.com/resources/${res.id}`
        });
      } else {
        this.seo.setMetaTags({
          title: 'Applicant Guides & Resources | ScholarshipHub',
          description: 'Access premium guides, application secrets, interview strategies, and academic FAQs to secure scholarship funding.',
          type: 'website'
        });
      }
    });
  }

  public filteredResources = computed(() => {
    let list = this.svc.resources();
    
    // Only return published ones for public view
    list = list.filter(r => r.status === 'published');

    const cat = this.activeCategory();
    if (cat !== 'All') {
      list = list.filter(r => r.category === cat);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.excerpt.toLowerCase().includes(query) ||
        r.content.toLowerCase().includes(query)
      );
    }

    // Sort by publication date descending
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  });

  public htmlContent = computed(() => {
    const raw = this.selectedResource()?.content || '';
    if (!raw) return '';

    let html = raw;
    // Replace markdown structures safely:
    html = html.replace(/^##\s*(.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^###\s*(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^\-\s*(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Custom handling for Q & A formatted structures if found in FAQs
    html = html.replace(/^Q:\s*(.*?)$/gm, '<div class="q-block">Q: $1</div>');
    html = html.replace(/^A:\s*(.*?)$/gm, '<div class="a-block">A: $1</div>');

    // Replace linebreaks with paragraph spacing
    html = html.replace(/\n\n/g, '<p></p>');

    return html;
  });

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentId.set(params.get('id'));
    });
  }

  public selectCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  public resetFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('All');
  }

  public goBack(): void {
    this.router.navigate(['/resources']);
  }

  public getCategoryClass(cat: string): string {
    switch (cat) {
      case 'Guide':
        return 'px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight bg-purple-500/10 border border-purple-500/20 text-purple-400';
      case 'Tip':
        return 'px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'FAQ':
        return 'px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight bg-indigo-500/10 border border-indigo-500/20 text-indigo-400';
      default:
        return 'px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight bg-slate-500/10 border border-slate-500/20 text-slate-400';
    }
  }

  public formatDate(isoString?: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  public getShareUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    const res = this.selectedResource();
    return res ? `https://scholarshiphub.com/resources/${res.id}` : '';
  }

  public getTwitterShareUrl(): string {
    const res = this.selectedResource();
    if (!res) return '#';
    const text = encodeURIComponent(`Master scholarship applications with this guide: ${res.title}`);
    const url = encodeURIComponent(this.getShareUrl());
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  public copyLink(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.getShareUrl()).then(() => {
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 2000);
      }).catch(err => {
        console.error('Failed to copy link:', err);
      });
    }
  }
}
