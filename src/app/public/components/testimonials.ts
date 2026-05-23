import { Component, ChangeDetectionStrategy, signal, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Testimonial {
  name: string;
  university: string;
  country: string;
  quote: string;
  initials: string;
  amount: string;
  program: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Success Stories Carousel — Polished Alignment -->
    <section class="mb-16 sm:mb-20">
      <div class="text-center mb-10">
        <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2 block">Student Impact</span>
        <h2 class="font-display font-black text-2xl sm:text-3xl text-white mb-2">Success Stories</h2>
        <p class="text-sm text-slate-400 font-sans max-w-md mx-auto">Real students who transformed their academic journey through ScholarshipHub</p>
      </div>

      <div class="relative max-w-3xl mx-auto" (mouseenter)="pause()" (mouseleave)="resume()">
        
        <!-- Testimonial Card -->
        <div class="frost-heavy rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          
          <!-- Background accent orbs -->
          <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/8 blur-[60px] pointer-events-none"></div>
          <div class="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-500/6 blur-[50px] pointer-events-none"></div>
          
          <!-- Top accent line -->
          <div class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent"></div>
          
          <!-- Quote icon -->
          <div class="flex justify-center mb-6">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <mat-icon class="!w-6 !h-6 !text-[24px] text-indigo-400">format_quote</mat-icon>
            </div>
          </div>
          
          <!-- Quote text — centered and balanced -->
          <blockquote class="text-center mb-8">
            <p class="text-base sm:text-lg lg:text-xl font-sans text-slate-200 leading-relaxed italic max-w-xl mx-auto">
              "{{ testimonials[currentIndex()].quote }}"
            </p>
          </blockquote>

          <!-- Author info — properly aligned center stack -->
          <div class="flex flex-col items-center gap-4">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center font-display border-2 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              {{ testimonials[currentIndex()].initials }}
            </div>
            
            <!-- Name and details — centered stack -->
            <div class="text-center">
              <div class="font-display font-bold text-white text-base mb-1">{{ testimonials[currentIndex()].name }}</div>
              <div class="text-xs text-slate-400 font-sans mb-2">{{ testimonials[currentIndex()].program }} • {{ testimonials[currentIndex()].university }}</div>
              <div class="text-xs text-slate-500 font-sans mb-3">{{ testimonials[currentIndex()].country }}</div>
            </div>
            
            <!-- Amount badge — centered -->
            <span class="text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)] inline-flex items-center gap-1.5">
              <mat-icon class="!w-3.5 !h-3.5 !text-[13px] text-amber-400">emoji_events</mat-icon>
              Won {{ testimonials[currentIndex()].amount }}
            </span>
          </div>
        </div>

        <!-- Navigation Arrows — properly positioned -->
        <button (click)="prevSlide()" 
                class="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 frost-medium rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer z-10 shadow-lg">
          <mat-icon class="!w-5 !h-5 !text-[18px]">chevron_left</mat-icon>
        </button>
        <button (click)="nextSlide()" 
                class="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 frost-medium rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer z-10 shadow-lg">
          <mat-icon class="!w-5 !h-5 !text-[18px]">chevron_right</mat-icon>
        </button>

        <!-- Dot Indicators — centered below -->
        <div class="flex items-center justify-center gap-2 mt-6">
          @for (t of testimonials; track t.name; let i = $index) {
            <button (click)="goToSlide(i)"
                    [class]="'rounded-full transition-all cursor-pointer border-none outline-none ' + 
                             (currentIndex() === i ? 'bg-indigo-500 w-8 h-2' : 'bg-slate-600 hover:bg-slate-500 w-2 h-2')">
            </button>
          }
        </div>

      </div>
    </section>
  `
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  public currentIndex = signal(0);
  private intervalId: any = null;

  public testimonials: Testimonial[] = [
    {
      name: 'Amara Okafor',
      university: 'University of Oxford',
      country: 'Lagos, Nigeria',
      quote: 'ScholarshipHub helped me discover the Rhodes Scholarship opportunity that changed my life. I am now pursuing my DPhil fully funded at Oxford.',
      initials: 'AO',
      amount: '$55,000/year',
      program: 'DPhil in Public Policy'
    },
    {
      name: 'Chen Wei',
      university: 'MIT',
      country: 'Shanghai, China',
      quote: 'As a first-generation college student, I had no idea where to start. ScholarshipHub\'s curated listings led me straight to MIT\'s full-ride program.',
      initials: 'CW',
      amount: '$82,000/year',
      program: 'B.S. Computer Science'
    },
    {
      name: 'Sofia Rodriguez',
      university: 'Stanford University',
      country: 'Bogotá, Colombia',
      quote: 'The deadline alerts feature saved me. I almost missed the Knight-Hennessy application window, but ScholarshipHub reminded me just in time.',
      initials: 'SR',
      amount: '$68,000/year',
      program: 'MBA'
    },
    {
      name: 'James Mwangi',
      university: 'University of Cambridge',
      country: 'Nairobi, Kenya',
      quote: 'I applied to 12 scholarships I found through ScholarshipHub. Won the Gates Cambridge Fellowship on my second try. Persistence pays off!',
      initials: 'JM',
      amount: '$48,000/year',
      program: 'MPhil Development Studies'
    }
  ];

  ngOnInit(): void {
    this.startAutoRotate();
  }

  ngOnDestroy(): void {
    this.stopAutoRotate();
  }

  public nextSlide(): void {
    this.currentIndex.update(i => (i + 1) % this.testimonials.length);
  }

  public prevSlide(): void {
    this.currentIndex.update(i => i === 0 ? this.testimonials.length - 1 : i - 1);
  }

  public goToSlide(index: number): void {
    this.currentIndex.set(index);
  }

  public pause(): void {
    this.stopAutoRotate();
  }

  public resume(): void {
    this.startAutoRotate();
  }

  private startAutoRotate(): void {
    this.stopAutoRotate();
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }

  private stopAutoRotate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
