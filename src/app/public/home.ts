import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';
import { SeoService } from '../services/seo';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { HeroComponent } from './components/hero';
import { StatsBarComponent } from './components/stats-bar';
import { PartnerLogosComponent } from './components/partner-logos';
import { CategoriesGridComponent } from './components/categories-grid';
import { FeaturedScholarshipsComponent } from './components/featured-scholarships';
import { FilterBarComponent } from './components/filter-bar';
import { ScholarshipCardComponent } from './components/scholarship-card';
import { ClosingSoonComponent } from './components/closing-soon';
import { HowItWorksComponent } from './components/how-it-works';
import { TestimonialsComponent } from './components/testimonials';
import { NewsletterCtaComponent } from './components/newsletter-cta';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    MatIconModule, 
    HeaderComponent, 
    FooterComponent, 
    HeroComponent,
    StatsBarComponent,
    PartnerLogosComponent,
    CategoriesGridComponent,
    FeaturedScholarshipsComponent,
    FilterBarComponent, 
    ScholarshipCardComponent,
    ClosingSoonComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    NewsletterCtaComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top-level Canvas — Premium Glassmorphism Homepage -->
    <div id="home-directory-canvas" class="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden z-10">
      
      <!-- Glow background orbs (Deep layered, animated drift) -->
      <div class="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-indigo-500/15 blur-[180px] pointer-events-none -z-10 orb-drift-1"></div>
      <div class="absolute top-[25%] right-[-15%] w-[45rem] h-[45rem] rounded-full bg-emerald-500/10 blur-[160px] pointer-events-none -z-10 orb-drift-2"></div>
      <div class="absolute bottom-[-15%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-violet-500/8 blur-[150px] pointer-events-none -z-10 orb-drift-3"></div>
      <div class="absolute top-[60%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none -z-10 orb-drift-1"></div>

      <!-- Primary sticky header -->
      <app-header />

      <!-- Main Content -->
      <main class="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <!-- 1. Premium Hero Section -->
        <app-hero (heroSearch)="onSearchChange($event)" />

        <!-- 2. Trust Stats Ribbon -->
        <app-stats-bar />

        <!-- 3. Partner Logos Marquee -->
        <app-partner-logos />

        <!-- 4. Featured Opportunities -->
        @if (svc.featuredScholarships().length > 0) {
          <app-featured-scholarships [scholarships]="svc.featuredScholarships()" />
        }

        <!-- 5. Browse by Category Grid -->
        <app-categories-grid 
          [selectedCategory]="selectedCategory()"
          (categorySelect)="onSelectCategory($event)" />

        <!-- 6. Main Directory Section -->
        <div id="scholarship-directory-section">
          <!-- Filter & Search Bar -->
          <app-filter-bar 
            [categories]="filterCategories" 
            [selectedCategory]="selectedCategory()" 
            [searchQuery]="searchQuery()" 
            [activeTag]="activeTag()"
            [resultCount]="filteredScholarships().length"
            (categoryChange)="onSelectCategory($event)"
            (searchChange)="onSearchChange($event)"
            (tagClear)="clearTag()"
            (tagSelect)="onSelectTag($event)"
            (sortChange)="onSortChange($event)" />

          <!-- Directory list items -->
          @if (filteredScholarships().length === 0) {
            <div class="text-center py-16 frost-heavy rounded-2xl p-8 max-w-md mx-auto">
              <mat-icon class="!w-10 !h-10 !text-[44px] text-slate-500 mb-3">youtube_searched_for</mat-icon>
              <h3 class="font-display font-bold text-sm text-white mb-1">No Opportunities Found</h3>
              <p class="text-xs text-slate-400 font-sans mb-4">No scholarships match your filter parameters. Try broader keywords.</p>
              <button (click)="onResetFilters()"
                      class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)] transition-colors">
                Reset All Filters
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              @for (item of filteredScholarships(); track item.id; let i = $index) {
                <app-scholarship-card 
                  [item]="item" 
                  (tagSelect)="onSelectTag($event)" />
              }
            </div>
          }
        </div>

        <!-- 7. Closing Soon Section -->
        @if (svc.closingSoonScholarships().length > 0) {
          <div class="mt-16">
            <app-closing-soon [scholarships]="svc.closingSoonScholarships()" />
          </div>
        }

        <!-- 8. How It Works -->
        <app-how-it-works />

        <!-- 9. Success Stories -->
        <app-testimonials />

        <!-- 10. Newsletter CTA -->
        <app-newsletter-cta />

      </main>

      <!-- Enhanced Footer -->
      <app-footer />

    </div>
  `
})
export class HomeComponent implements OnInit {
  public svc = inject(ScholarshipService);
  public seo = inject(SeoService);

  public filterCategories = ['All', 'Fully-Funded', 'Partial', 'Undergrad', 'Postgrad', 'PhD'];
  
  public selectedCategory = signal<string>('All');
  public searchQuery = signal<string>('');
  public activeTag = signal<string | null>(null);
  public sortBy = signal<string>('deadline');

  constructor() {
    effect(() => {
      const scholarships = this.filteredScholarships();
      const currentCategory = this.selectedCategory();
      const activeTagVal = this.activeTag();
      const queryText = this.searchQuery().trim();

      const topHighlights = scholarships.slice(0, 3).map(s => s.title).join(', ');
      const highlightSuffix = topHighlights ? ` Featuring: ${topHighlights}.` : '';
      const totalCount = scholarships.length;
      
      const distinctTagsInView = Array.from(new Set(scholarships.flatMap(s => s.tags))).slice(0, 8);
      const tagsString = distinctTagsInView.length > 0 ? ` [Key themes: ${distinctTagsInView.map(t => '#' + t).join(', ')}]` : '';

      let pageTitle = 'ScholarshipHub | Premium Academic Opportunities Directory';
      let pageDescription = `Access a streamlined, verified selection of high-yield fully-funded doctoral, master's, and undergraduate academic grants worldwide.${highlightSuffix}`;
      
      const defaultKeywords = ['scholarships', 'academic funding', 'fully funded', 'doctoral fellowships', 'master grants', 'undergraduate awards'];
      const dynamicKeywords = [...defaultKeywords, ...distinctTagsInView];

      if (currentCategory !== 'All') {
        pageTitle = `Find ${currentCategory} Scholarships (${totalCount} Active) | ScholarshipHub`;
        pageDescription = `Browse our expert-verified index of ${totalCount} premium ${currentCategory} scholarships. Apply for fully-funded opportunities, fellowships, and academic stipends.${highlightSuffix}${tagsString}`;
        dynamicKeywords.push(currentCategory, `fully funded ${currentCategory}`, `apply ${currentCategory}`);
      }

      if (activeTagVal) {
        pageTitle = `Scholarships Tagged #${activeTagVal} (${totalCount} Available) | ScholarshipHub`;
        pageDescription = `Explore and compare ${totalCount} college scholarships and research grants tagged with #${activeTagVal}. Modern assistance and funding packages available.${highlightSuffix}`;
        dynamicKeywords.push(activeTagVal, `scholarships for ${activeTagVal}`, `${activeTagVal} funding`);
      }

      if (queryText) {
        pageTitle = `Search: "${queryText}" (${totalCount} Matches) | ScholarshipHub`;
        pageDescription = `Verified search listings matching academic query "${queryText}". Found ${totalCount} research, study, and financial aid grants.${highlightSuffix}`;
        dynamicKeywords.push(queryText, `${queryText} scholarships`, `${queryText} fellowship`);
      }

      const keywordList = Array.from(new Set(dynamicKeywords)).join(', ');

      this.seo.setMetaTags({
        title: pageTitle,
        description: pageDescription,
        keywords: keywordList,
        ogImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        ogUrl: typeof window !== 'undefined' ? window.location.href : 'https://scholarshiphub.com',
        type: 'website'
      });

      const schemaList = scholarships.slice(0, 15).map((item, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'url': `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}//${typeof window !== 'undefined' ? window.location.host : 'scholarshiphub.com'}/scholarship/${item.id}`,
        'name': item.title,
        'description': item.excerpt,
        'image': item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
      }));

      this.seo.setSchema({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': `${currentCategory} Academic Opportunities Catalogue`,
        'description': pageDescription,
        'numberOfItems': scholarships.length,
        'itemListElement': schemaList
      });
    });
  }

  public filteredScholarships = computed(() => {
    let list: Scholarship[] = this.svc.getPublishedScholarships();

    const cat = this.selectedCategory();
    if (cat !== 'All') {
      list = list.filter(item => 
        item.category === cat || 
        item.fundingType === cat ||
        item.field === cat ||
        item.country === cat ||
        item.demographic === cat
      );
    }

    const tag = this.activeTag();
    if (tag) {
      list = list.filter(item => item.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        (item.country && item.country.toLowerCase().includes(q)) ||
        (item.field && item.field.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    const sort = this.sortBy();
    if (sort === 'deadline') {
      list = [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sort === 'amount') {
      list = [...list].sort((a, b) => b.amount - a.amount);
    } else if (sort === 'popularity') {
      list = [...list].sort((a, b) => b.views - a.views);
    }

    return list;
  });

  public ngOnInit(): void {}

  public onSelectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    // Scroll to directory section when selecting from the categories grid
    setTimeout(() => {
      const el = document.getElementById('scholarship-directory-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  public onSearchChange(val: string): void {
    this.searchQuery.set(val);
  }

  public onSelectTag(tag: string): void {
    this.activeTag.set(tag);
  }

  public clearTag(): void {
    this.activeTag.set(null);
  }

  public onSortChange(val: string): void {
    this.sortBy.set(val);
  }

  public onResetFilters(): void {
    this.selectedCategory.set('All');
    this.searchQuery.set('');
    this.activeTag.set(null);
    this.sortBy.set('deadline');
  }
}
