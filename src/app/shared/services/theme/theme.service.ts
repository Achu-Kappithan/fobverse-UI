import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const isInitialDark = savedTheme === 'dark';
    this.setDarkMode(isInitialDark);
  }

  public setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  public toggleDarkMode(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }
}
