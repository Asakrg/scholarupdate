import { Component, inject, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../services/scholarship';
import { SeoService } from '../services/seo';
import { HeaderComponent } from '../layout/header';
import { FooterComponent } from '../layout/footer';
import { RedirectionModalComponent } from './components/redirection-modal';
import { RelatedDiscoveriesComponent } from './components/related-discoveries';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
    RedirectionModalComponent,
    RelatedDiscoveriesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './details.html'
})
export class DetailsComponent implements OnInit, OnDestroy {
  public svc = inject(ScholarshipService);
  public seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  public scholarship = signal<Scholarship | null>(null);
  public linkCopied = signal<boolean>(false);
  public showConfirmationModal = signal<boolean>(false);
  public activeRedirectUrl = signal<string>('');

  // Countdown Signals
  public daysRemaining = signal<string>('00');
  public hoursRemaining = signal<string>('00');
  public minutesRemaining = signal<string>('00');
  public secondsRemaining = signal<string>('00');
  public isExpired = signal<boolean>(false);
  private timerId: any = null;

  // Bookmark Signal
  public bookmarked = signal<boolean>(false);

  public onApplyClick(event: Event, url: string | undefined): void {
    if (!url) return;
    event.preventDefault(); // intercept native immediate redirection
    this.activeRedirectUrl.set(url);
    this.showConfirmationModal.set(true);
  }

  constructor() {
    effect(() => {
      const s = this.scholarship();
      if (s) {
        let sponsorName = 'Sponsoring University';
        if (s.title.includes(' at ')) {
          sponsorName = s.title.split(' at ')[1].split(' - ')[0].trim();
        } else if (s.title.includes(' from ')) {
          sponsorName = s.title.split(' from ')[1].split(' - ')[0].trim();
        }

        const categoryTagText = s.tags && s.tags.length > 0 ? ` [${s.tags.slice(0, 2).map(t => '#' + t).join(', ')}]` : '';
        const titleStr = s.metaTitle ? s.metaTitle.trim() : `${s.title} - ${s.amountDisplay} (${s.category}${categoryTagText})`;
        
        const tagsSentence = s.tags && s.tags.length > 0 ? ` Focus & Tags: ${s.tags.map(t => '#' + t).join(', ')}.` : '';
        const fundingText = s.amountDisplay ? ` Financial package value: ${s.amountDisplay}.` : '';
        const formattedDeadline = s.deadline ? new Date(s.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'soon';
        const descriptionStr = s.metaDescription ? s.metaDescription.trim() : `${s.excerpt || 'Read verified description and eligibility specs.'}${fundingText} Academic Tier: ${s.category}.${tagsSentence} Application deadline: ${formattedDeadline}.`;

        const hostKeywords = sponsorName !== 'Sponsoring University' ? [sponsorName, `${sponsorName} funding`] : [];
        const titleWords = s.title.toLowerCase().split(/[^a-zA-Z]/).filter(w => w.length > 3 && !['scholarship', 'scholarships', 'fellowship', 'university', 'grant', 'program', 'apply'].includes(w));
        const dynamicKeywords = [
          s.category,
          ...s.tags,
          ...titleWords,
          ...hostKeywords,
          'fully funded',
          'financial aid grants',
          'academic fellowships'
        ].filter(Boolean);
        const keywordsStr = Array.from(new Set(dynamicKeywords)).join(', ');

        this.seo.setMetaTags({
          title: titleStr,
          description: descriptionStr,
          keywords: keywordsStr,
          ogImage: s.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
          ogUrl: typeof window !== 'undefined' ? window.location.href : `https://scholarshiphub.com/scholarship/${s.id}`,
          type: 'article'
        });

        this.seo.setSchema({
          '@context': 'https://schema.org',
          '@type': 'Grant',
          'name': s.title,
          'description': s.excerpt || descriptionStr,
          'image': s.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
          'url': typeof window !== 'undefined' ? window.location.href : `https://scholarshiphub.com/scholarship/${s.id}`,
          'sponsor': {
            '@type': 'Organization',
            'name': sponsorName,
            'url': s.applyUrl || 'https://scholarshiphub.com'
          },
          'amount': {
            '@type': 'MonetaryAmount',
            'currency': 'USD',
            'value': s.amountDisplay
          },
          'recipient': {
            '@type': 'Audience',
            'audienceType': s.eligibility || 'Eligible academic candidates'
          },
          'educationalLevel': s.category,
          'fundingType': 'Scholarship',
          'endDate': s.deadline
        });
      } else {
        this.seo.setMetaTags({
          title: 'Opportunity Not Resolved | ScholarshipHub',
          description: 'We could not resolve this scholarship ID in our registers. It might have been saved as a hidden draft.',
          type: 'website'
        });
        this.seo.setSchema(null);
      }
    });
  }

  public relatedScholarships = computed(() => {
    const current = this.scholarship();
    if (!current) return [];

    const all = this.svc.getPublishedScholarships();
    const currentTags = current.tags || [];
    const currentCategory = current.category;

    return all
      .filter(item => item.id !== current.id)
      .map(item => {
        let score = 0;
        if (item.category === currentCategory) {
          score += 3;
        }
        const itemTags = item.tags || [];
        const matchingTagsCount = itemTags.filter(t => currentTags.some(ct => ct.toLowerCase() === t.toLowerCase())).length;
        score += matchingTagsCount * 2;

        const wordsToMatch = current.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const itemText = (item.title + ' ' + item.excerpt).toLowerCase();
        wordsToMatch.forEach(word => {
          if (itemText.includes(word)) {
            score += 1;
          }
        });

        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item)
      .slice(0, 3);
  });

  public getShareUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    const s = this.scholarship();
    return s ? `https://scholarshiphub.com/scholarship/${s.id}` : '';
  }

  public getTwitterShareUrl(): string {
    const s = this.scholarship();
    if (!s) return '#';
    const text = encodeURIComponent(`Check out this premier scholarship opportunity: ${s.title}`);
    const url = encodeURIComponent(this.getShareUrl());
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  public getLinkedInShareUrl(): string {
    const s = this.scholarship();
    if (!s) return '#';
    const url = encodeURIComponent(this.getShareUrl());
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  public getEmailShareUrl(): string {
    const s = this.scholarship();
    if (!s) return '#';
    const subject = encodeURIComponent(`Scholarship Opportunity: ${s.title}`);
    const body = encodeURIComponent(`Hi, check out this academic funding opportunity: ${s.title}\n\nValue: ${s.amountDisplay}\nDeadline: ${s.deadline}\n\nView details: ${this.getShareUrl()}`);
    return `mailto:?subject=${subject}&body=${body}`;
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

  public htmlDescription = computed(() => {
    const original = this.scholarship()?.description || '';
    if (!original) return '';

    let html = original;
    html = html.replace(/^##\s*(.*?)$/gm, '<h3 class="text-sm font-sans font-black tracking-normal uppercase text-white border-b border-white/10 pb-1.5 mb-2 mt-6">$1</h3>');
    html = html.replace(/^\-\s*(.*?)$/gm, '<div class="flex items-start gap-2 text-xs text-slate-300 mb-1.5"><span class="text-indigo-400 font-bold">&#8226;</span><span>$1</span></div>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\n\n/g, '<div class="h-3"></div>');
    return html;
  });

  // Calendar event export handlers
  public getGoogleCalendarUrl(): string {
    const s = this.scholarship();
    if (!s) return '#';
    const d = new Date(s.deadline);
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const start = formatDate(d);
    const end = formatDate(new Date(d.getTime() + 60 * 60 * 1000));
    const title = encodeURIComponent(`Apply: ${s.title}`);
    const details = encodeURIComponent(`Deadline reminder for ${s.title}.\nValue: ${s.amountDisplay}.\nApply URL: ${s.applyUrl}\nDetails: ${this.getShareUrl()}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  }

  public downloadCalendarFile(): void {
    const s = this.scholarship();
    if (!s) return;
    const deadlineDate = new Date(s.deadline);
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startStr = formatDate(deadlineDate);
    const endDate = new Date(deadlineDate.getTime() + 60 * 60 * 1000);
    const endStr = formatDate(endDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ScholarshipHub//Academic Calendar//EN',
      'BEGIN:VEVENT',
      `UID:scholarship-${s.id}@scholarshiphub.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:Apply for ${s.title}`,
      `DESCRIPTION:Reminder to submit your application for the ${s.title}. Value: ${s.amountDisplay}. Eligibility: ${s.eligibility}. Official URL: ${s.applyUrl}`,
      `URL:${this.getShareUrl()}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `deadline-${s.id}.ics`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Bookmark Toggle
  public toggleBookmark(): void {
    const s = this.scholarship();
    if (!s) return;
    const newValue = !this.bookmarked();
    this.bookmarked.set(newValue);
    if (typeof window !== 'undefined') {
      if (newValue) {
        window.localStorage.setItem('bookmarked_' + s.id, 'true');
      } else {
        window.localStorage.removeItem('bookmarked_' + s.id);
      }
    }
  }

  // Live Timer Core
  private startCountdown(deadline: string): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    const targetTime = new Date(deadline).getTime();
    
    const update = () => {
      const now = Date.now();
      const difference = targetTime - now;
      if (difference <= 0) {
        this.isExpired.set(true);
        this.daysRemaining.set('00');
        this.hoursRemaining.set('00');
        this.minutesRemaining.set('00');
        this.secondsRemaining.set('00');
        if (this.timerId) {
          clearInterval(this.timerId);
        }
        return;
      }
      this.isExpired.set(false);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.daysRemaining.set(days.toString().padStart(2, '0'));
      this.hoursRemaining.set(hours.toString().padStart(2, '0'));
      this.minutesRemaining.set(minutes.toString().padStart(2, '0'));
      this.secondsRemaining.set(seconds.toString().padStart(2, '0'));
    };

    update();
    this.timerId = setInterval(update, 1000);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const match = this.svc.getScholarshipById(id);
        if (match) {
          this.scholarship.set(match);
          this.svc.incrementViews(id);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.bookmarked.set(window.localStorage.getItem('bookmarked_' + id) === 'true');
            this.startCountdown(match.deadline);
          }
        } else {
          this.scholarship.set(null);
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
