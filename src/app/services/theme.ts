import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme = signal<'dark' | 'light'>('dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        this.theme.set(savedTheme);
      } else {
        // Fallback to default dark
        this.theme.set('dark');
      }
      this.applyTheme(this.theme());
    }
  }

  public toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      this.applyTheme(nextTheme);
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light-mode');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.remove('light-mode');
        root.setAttribute('data-theme', 'dark');
      }
    }
  }
}
