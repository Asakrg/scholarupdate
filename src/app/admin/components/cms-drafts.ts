import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-cms-drafts',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header Banner -->
      <div class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl text-slate-200">
        <div class="flex items-center gap-2.5 border-b border-white/10 pb-3 mb-4">
          <mat-icon class="!w-5 !h-5 !text-[20px] text-indigo-400">pending_actions</mat-icon>
          <h2 class="text-base font-display font-bold text-slate-100">Discovered Opportunities Queue</h2>
          <span class="ml-1.5 px-2 py-0.5 text-[8.5px] font-mono rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-bold uppercase tracking-wider">
            Draft Approval Station
          </span>
        </div>

        <p class="text-xs text-slate-400 font-sans leading-relaxed">
          These opportunities are automatically scanned and extracted in the background by the Firecrawl Scraper Agent. Approve them to save them as drafts in your primary database, edit them directly to refine details, or dismiss them to clear them from the discovery cache.
        </p>
      </div>

      <!-- Main Drafts Container -->
      @if (svc.autoDrafts().length === 0) {
        <div class="border border-white/5 bg-slate-950/20 backdrop-blur-xl rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
            <mat-icon class="!w-6 !h-6 !text-[24px]">inbox</mat-icon>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-display font-bold text-slate-300">Draft Queue Clear</h3>
            <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              No new background opportunities have been discovered. Run the web scraper manually in the Scraper tab to extract new listings.
            </p>
          </div>
          <button (click)="refreshQueue()" 
                  class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl shadow-sm transition-all cursor-pointer">
            <mat-icon class="!w-4 !h-4 !text-[14px]">refresh</mat-icon>
            <span>Refresh Queue</span>
          </button>
        </div>
      } @else {
        <!-- Actions & Header control row -->
        <div class="flex items-center justify-between px-2 select-none">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Pending Discovery List ({{ svc.autoDrafts().length }})
          </span>
          <button (click)="refreshQueue()" 
                  class="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer focus:outline-none text-[11px] font-mono">
            <mat-icon class="!w-3 !h-3 !text-[12px]">refresh</mat-icon>
            <span>Sync Queue</span>
          </button>
        </div>

        <!-- Grid of Drafts Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (opp of svc.autoDrafts(); track opp.id) {
            <div class="border border-white/10 bg-slate-950/40 hover:bg-slate-900/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 group hover:border-white/20">
              <div>
                <!-- Image Header -->
                <div class="relative h-32 bg-slate-950">
                  <img [src]="opp.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'" 
                       alt="" class="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer" />
                  
                  <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 text-[8.5px] font-sans font-bold bg-slate-950/90 text-indigo-300 rounded-lg uppercase tracking-wider border border-indigo-500/20 backdrop-blur-md">
                      {{ opp.category }}
                    </span>
                  </div>
                  
                  <div class="absolute top-3 right-3">
                    <span class="px-2.5 py-1 text-[8.5px] font-mono bg-indigo-950/90 text-indigo-400 rounded-lg uppercase tracking-wider border border-indigo-500/30 backdrop-blur-md font-bold">
                      AUTO-DISCOVERED
                    </span>
                  </div>
                </div>

                <!-- Info Body -->
                <div class="p-4 space-y-3">
                  <h4 class="font-display font-bold text-sm text-slate-100 leading-snug line-clamp-2 min-h-[38px] group-hover:text-indigo-400 transition-colors" [title]="opp.title">
                    {{ opp.title }}
                  </h4>
                  
                  <div class="border-t border-b border-white/5 py-2.5 my-2">
                    <table class="w-full text-xs font-sans text-slate-400 border-collapse table-fixed">
                      <tbody>
                        <tr>
                          <td class="py-1 font-mono text-[9px] uppercase tracking-wider text-slate-500 w-20">Value:</td>
                          <td class="py-1 font-semibold text-indigo-400 truncate text-[11px]">{{ opp.amountDisplay }}</td>
                        </tr>
                        <tr>
                          <td class="py-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">Deadline:</td>
                          <td class="py-1 font-mono text-rose-450 font-bold truncate text-[11px]">{{ opp.deadline }}</td>
                        </tr>
                        <tr>
                          <td class="py-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">Eligibility:</td>
                          <td class="py-1 truncate text-slate-300 font-medium text-[11px]" [title]="opp.eligibility || 'Not Specified'">
                            {{ opp.eligibility || 'Not Specified' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans mt-1">
                    {{ opp.excerpt }}
                  </p>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="p-3 bg-slate-950/60 border-t border-white/5 flex items-center justify-between gap-2.5">
                <button (click)="dismissAutoDraft(opp.id)"
                        class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 font-semibold text-xs transition-all border border-rose-500/20 cursor-pointer focus:outline-none select-none">
                  <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">delete</mat-icon>
                  <span>Dismiss</span>
                </button>

                <div class="flex items-center gap-2">
                  <button (click)="loadAiOpportunityIntoForm(opp)"
                          class="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-white/10 bg-slate-800/40 hover:bg-slate-700/60 font-semibold text-xs text-slate-200 cursor-pointer select-none transition-all">
                    <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-slate-400 font-bold">edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button (click)="approveAutoDraft(opp)"
                          class="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer select-none border border-white/10 transition-colors">
                    <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">check</mat-icon>
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class CmsDraftsComponent implements OnInit {
  public svc = inject(ScholarshipService);

  @Output() editDraft = new EventEmitter<Scholarship>();

  public ngOnInit(): void {
    this.refreshQueue();
  }

  public async refreshQueue(): Promise<void> {
    await this.svc.fetchAutoDrafts();
  }

  public async approveAutoDraft(opp: Scholarship): Promise<void> {
    try {
      await this.svc.approveAutoDraft(opp);
      this.svc.showToast('success', 'Opportunity Approved', `Successfully saved "${opp.title}" into the main index database.`);
    } catch (e) {
      this.svc.showToast('error', 'Approval Failed', 'Failed to approve this opportunity.');
    }
  }

  public async dismissAutoDraft(id: string): Promise<void> {
    try {
      await this.svc.dismissAutoDraft(id);
      this.svc.showToast('success', 'Opportunity Dismissed', 'Removed opportunity from the pending queue.');
    } catch (e) {
      this.svc.showToast('error', 'Dismiss Failed', 'Failed to dismiss this opportunity.');
    }
  }

  public loadAiOpportunityIntoForm(opp: Scholarship): void {
    this.editDraft.emit(opp);
  }
}
