import { Component, ChangeDetectionStrategy, ElementRef, AfterViewInit, OnDestroy, signal, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-bar',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Trust Stats Ribbon — Animated Count-Up on Scroll -->
    <section class="mb-16 sm:mb-20 relative">
      <!-- Emerald glow accent behind -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-emerald-500/8 blur-[80px] pointer-events-none"></div>
      
      <div class="text-center mb-6">
        <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Trusted by Students Worldwide</span>
      </div>

      <div class="frost-medium rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <!-- Subtle emerald edge glow -->
        <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-display font-black text-white mb-1" [class.count-animated]="animated()">
              {{ animatedValues()[0] | number }}+
            </div>
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Scholarships Indexed</div>
          </div>

          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-display font-black text-white mb-1" [class.count-animated]="animated()">
              {{ animatedValues()[1] | number }}+
            </div>
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Students Matched</div>
          </div>

          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-display font-black text-white mb-1" [class.count-animated]="animated()">
              {{ animatedValues()[2] | number }}+
            </div>
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Partner Universities</div>
          </div>

          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-display font-black text-emerald-400 mb-1" [class.count-animated]="animated()">
              \${{ animatedValues()[3] }}B+
            </div>
            <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Listed Financial Aid</div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class StatsBarComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);
  private observer: IntersectionObserver | null = null;

  public animated = signal(false);
  public animatedValues = signal<(number | string)[]>([0, 0, 0, '0.0']);

  private targets = [12400, 50000, 2800, 2.1];
  private duration = 2000;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated()) {
            this.startCountUp();
          }
        });
      }, { threshold: 0.3 });

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private startCountUp(): void {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      this.zone.run(() => {
        this.animatedValues.set([
          Math.round(this.targets[0] * eased),
          Math.round(this.targets[1] * eased),
          Math.round(this.targets[2] * eased),
          (this.targets[3] * eased).toFixed(1)
        ]);

        if (progress >= 1) {
          this.animated.set(true);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
}
