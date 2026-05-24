import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-scholarship-card',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'block h-full' },
  template: `
    <!-- Scholarship Card — Enhanced with Visual Hierarchy -->
    <article [id]="'scholarship-card-' + item.id" 
             class="scholarship-card h-full flex flex-col justify-between frost-medium frost-glow rounded-2xl overflow-hidden transition-all duration-300 group">
      
      <!-- Header Card Cover -->
      <div class="relative h-44 sm:h-52 bg-slate-900 overflow-hidden shrink-0">
        <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'" 
             alt="" class="h-full w-full object-cover select-none brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
             referrerpolicy="no-referrer" />
        
        <!-- Floating category pill (Glass styled) -->
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 text-[10px] font-sans font-bold text-indigo-200 bg-indigo-950/60 backdrop-blur-md rounded-lg shadow-sm border border-indigo-500/20 uppercase tracking-wide">
            {{ item.category }}
          </span>
        </div>

        <!-- Country badge -->
        @if (item.country) {
          <div class="absolute top-4 right-14">
            <span class="px-2 py-1 text-[10px] font-mono font-bold text-slate-200 bg-slate-950/60 backdrop-blur-md rounded-lg border border-white/10">
              {{ item.country }}
            </span>
          </div>
        }

        <!-- Bookmark heart -->
        <button (click)="toggleBookmark($event)"
                class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-950/50 backdrop-blur-md border border-white/10 cursor-pointer focus:outline-none z-10"
                [title]="bookmarked() ? 'Remove bookmark' : 'Save scholarship'">
          <mat-icon [class]="'!w-4 !h-4 !text-[16px] bookmark-heart ' + (bookmarked() ? 'active text-rose-500' : 'text-slate-400 hover:text-white')">
            {{ bookmarked() ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>

        <!-- Small deadline notice (Glass styled) -->
        <div class="absolute bottom-4 right-4 bg-rose-950/65 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-rose-300 shadow-sm flex items-center gap-1 border border-rose-500/25">
          <mat-icon class="!w-3 !h-3 !text-[11px] text-rose-400">schedule</mat-icon>
          <span>Deadline: {{ item.deadline | date:'mediumDate' }}</span>
        </div>
      </div>

      <!-- Text details inside -->
      <div class="p-6 flex flex-col flex-grow">
        <!-- Title -->
        <div class="mb-2">
          <h3 class="text-md sm:text-lg font-display font-extrabold text-white leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-indigo-300 transition-colors">
            {{ item.title }}
          </h3>
        </div>

        <div>
          <div class="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 rounded px-2.5 py-1 mb-4 inline-block backdrop-blur-sm">
            Allocated Value: {{ item.amountDisplay }}
          </div>
        </div>

        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5 line-clamp-3 flex-grow">
          {{ item.excerpt }}
        </p>

        <div class="mt-auto">
          <div class="text-[11px] border-t border-b border-dashed border-white/10 py-2.5 mb-4 font-sans text-slate-300 flex items-center gap-1.5">
            <span class="font-bold text-slate-500 font-mono uppercase text-[9px]">Eligibility:</span>
            <span class="truncate" [title]="item.eligibility">{{ item.eligibility }}</span>
          </div>

          <!-- Metadata Tags list (Glass styled buttons) -->
          <div class="flex flex-wrap items-center gap-1.5">
            @for (tag of item.tags; track tag) {
              <button (click)="onTagClick(tag); $event.stopPropagation()"
                      class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                #{{ tag }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Action row footer (Glass styled) -->
      <div class="px-6 pb-5 pt-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
        <div class="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-bold">
          <mat-icon class="!w-3.5 !h-3.5 !text-[12px] text-slate-400">visibility</mat-icon>
          <span>{{ item.views }} readers</span>
        </div>

        <div class="flex items-center gap-2 relative">
          <!-- Share Button -->
          <button (click)="toggleShareMenu($event)"
                  class="inline-flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none select-none">
            <mat-icon class="!w-4 !h-4 !text-[16px]">share</mat-icon>
          </button>

          <!-- Share Popover -->
          @if (isShareOpen()) {
            <div class="absolute right-0 bottom-full mb-2.5 z-20 w-48 border border-white/10 bg-slate-950/95 backdrop-blur-lg rounded-xl shadow-2xl p-1.5 text-left font-sans animate-slide-in">
              <div class="px-2.5 py-1 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider border-b border-white/10 mb-1 flex items-center justify-between">
                <span>Share Grant</span>
                <button (click)="isShareOpen.set(false); $event.stopPropagation()" class="text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer">
                  <mat-icon class="!w-3 !h-3 !text-[10px] font-bold">close</mat-icon>
                </button>
              </div>
              
              <a [href]="getTwitterShareUrl(item)" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation(); isShareOpen.set(false)"
                 class="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white font-sans transition-colors">
                <svg class="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>Twitter / X</span>
              </a>

              <a [href]="getLinkedInShareUrl(item)" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation(); isShareOpen.set(false)"
                 class="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white font-sans transition-colors">
                <svg class="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span>LinkedIn</span>
              </a>

              <a [href]="getEmailShareUrl(item)" (click)="$event.stopPropagation(); isShareOpen.set(false)"
                 class="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white font-sans transition-colors">
                <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-slate-400">mail</mat-icon>
                <span>Email</span>
              </a>

              <button (click)="copyCardLink($event)"
                      class="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white font-sans transition-colors text-left cursor-pointer focus:outline-none select-none">
                <div class="flex items-center gap-2">
                  <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-slate-400">
                    {{ copied() ? 'check_circle' : 'content_copy' }}
                  </mat-icon>
                  <span [class.text-emerald-400]="copied()">
                    {{ copied() ? 'Copied' : 'Copy Link' }}
                  </span>
                </div>
              </button>
            </div>
          }

          <a [routerLink]="['/scholarship', item.id]"
             class="inline-flex items-center gap-1 px-4 py-2 font-semibold text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_18px_rgba(99,102,241,0.5)] border border-indigo-500/30 transition-all shrink-0 whitespace-nowrap focus:outline-none">
            <span>View Details</span>
            <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">arrow_forward</mat-icon>
          </a>
        </div>
      </div>

      <!-- Deadline urgency color bar at bottom -->
      <div [class]="'urgency-bar ' + getUrgencyClass()"></div>

    </article>
  `
})
export class ScholarshipCardComponent implements OnInit {
  @Input({ required: true }) item!: Scholarship;
  @Output() tagSelect = new EventEmitter<string>();

  public isShareOpen = signal<boolean>(false);
  public copied = signal<boolean>(false);
  public bookmarked = signal<boolean>(false);

  public ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.bookmarked.set(window.localStorage.getItem('bookmarked_' + this.item.id) === 'true');
    }
  }

  public onTagClick(tag: string): void {
    this.tagSelect.emit(tag);
  }

  public toggleBookmark(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    const newValue = !this.bookmarked();
    this.bookmarked.set(newValue);
    if (typeof window !== 'undefined') {
      if (newValue) {
        window.localStorage.setItem('bookmarked_' + this.item.id, 'true');
      } else {
        window.localStorage.removeItem('bookmarked_' + this.item.id);
      }
    }
  }

  public getUrgencyClass(): string {
    const days = Math.ceil((new Date(this.item.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return 'urgency-danger';
    if (days <= 30) return 'urgency-warning';
    return 'urgency-safe';
  }

  public getCardShareUrl(item: Scholarship): string {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/scholarship/${item.id}`;
    }
    return `https://scholarshiphub.com/scholarship/${item.id}`;
  }

  public getTwitterShareUrl(item: Scholarship): string {
    const text = encodeURIComponent(`Check out this premier scholarship opportunity: ${item.title}`);
    const url = encodeURIComponent(this.getCardShareUrl(item));
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  public getLinkedInShareUrl(item: Scholarship): string {
    const url = encodeURIComponent(this.getCardShareUrl(item));
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  public getEmailShareUrl(item: Scholarship): string {
    const subject = encodeURIComponent(`Scholarship Opportunity: ${item.title}`);
    const body = encodeURIComponent(`Hi, check out this academic funding opportunity: ${item.title}\n\nAllocated Value: ${item.amountDisplay}\nDeadline: ${item.deadline}\n\nRead more details here: ${this.getCardShareUrl(item)}`);
    return `mailto:?subject=${subject}&body=${body}`;
  }

  public copyCardLink(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.getCardShareUrl(this.item)).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
    this.isShareOpen.set(false);
  }

  public toggleShareMenu(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isShareOpen.update(prev => !prev);
  }
}
