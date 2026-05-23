import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-featured-scholarships',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Featured Opportunities — Premium Cards with Gold Accent -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-10">
        <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-2 flex items-center justify-center gap-2">
          <mat-icon class="!w-6 !h-6 !text-[24px] text-amber-400">auto_awesome</mat-icon>
          Featured Opportunities
        </h2>
        <p class="text-sm text-slate-400 font-sans">Hand-picked by our academic advisory board</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (item of scholarships.slice(0, 3); track item.id) {
          <article class="frost-heavy featured-glow rounded-2xl overflow-hidden flex flex-col group">
            <!-- Gold accent top bar -->
            <div class="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
            
            <!-- Image header -->
            <div class="relative h-40 bg-slate-900 overflow-hidden">
              <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'"
                   alt="" class="h-full w-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
                   referrerpolicy="no-referrer" />
              
              <!-- Staff Pick Badge -->
              <div class="absolute top-3 right-3 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg backdrop-blur-md">
                <span class="text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wide">Staff Pick</span>
              </div>

              <!-- Category badge -->
              <div class="absolute bottom-3 left-3">
                <span class="text-indigo-300 text-[10px] font-mono bg-indigo-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-wide font-bold">
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex flex-col flex-grow">
              <h3 class="font-display font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">{{ item.title }}</h3>
              
              <div class="flex items-center gap-2 mb-3">
                <span class="text-emerald-400 font-mono text-sm font-bold">{{ item.amountDisplay }}</span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-grow">{{ item.excerpt }}</p>

              <div class="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div class="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <mat-icon class="!w-3 !h-3 !text-[11px] text-rose-400">schedule</mat-icon>
                  <span>{{ item.deadline | date:'mediumDate' }}</span>
                </div>
                <a [routerLink]="['/scholarship', item.id]"
                   class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded-lg border border-indigo-500/30 transition-all cursor-pointer">
                  <span>Details</span>
                  <mat-icon class="!w-3 !h-3 !text-[11px]">arrow_forward</mat-icon>
                </a>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class FeaturedScholarshipsComponent {
  @Input({ required: true }) scholarships: Scholarship[] = [];
}
