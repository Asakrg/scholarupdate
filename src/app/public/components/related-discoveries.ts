import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-related-discoveries',
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items && items.length > 0) {
      <div class="mt-12 pt-8 border-t border-white/10">
        <div class="flex items-center gap-2 mb-6">
          <mat-icon class="!w-4 !h-4 !text-[18px] text-white">school</mat-icon>
          <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">
            Related Academic Discoveries
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          @for (item of items; track item.id) {
            <a [routerLink]="['/scholarship', item.id]"
               class="group block border border-white/10 bg-slate-950/60 backdrop-blur-md hover:bg-slate-900/80 hover:border-indigo-500/20 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
              <div class="flex sm:flex-col gap-3">
                <div class="w-16 h-16 sm:w-full sm:h-28 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                  <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80'" 
                       alt="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                       referrerpolicy="no-referrer" />
                </div>
                <div class="flex-grow min-w-0">
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <span class="inline-block px-1.5 py-0.5 text-[8px] font-mono font-bold bg-indigo-950/60 border border-indigo-500/20 backdrop-blur-sm text-indigo-200 rounded uppercase tracking-wider">
                      {{ item.category }}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                    {{ item.title }}
                  </h4>
                  <p class="text-[10px] text-emerald-400 font-bold font-mono mt-1">
                    {{ item.amountDisplay }}
                  </p>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    }
  `
})
export class RelatedDiscoveriesComponent {
  @Input() items: Scholarship[] = [];
}
