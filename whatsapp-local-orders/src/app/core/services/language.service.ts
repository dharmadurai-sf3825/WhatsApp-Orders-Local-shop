import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  private languageSubject = new BehaviorSubject<string>('ta'); // Tamil by default
  public language$: Observable<string> = this.languageSubject.asObservable();

  constructor() {
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const saved = localStorage.getItem(this.LANGUAGE_KEY);
    if (saved && (saved === 'ta' || saved === 'en')) {
      this.languageSubject.next(saved);
    }
  }

  setLanguage(lang: string): void {
    if (lang === 'ta' || lang === 'en') {
      localStorage.setItem(this.LANGUAGE_KEY, lang);
      this.languageSubject.next(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }

  translate(enText: string, taText?: string): string {
    return this.languageSubject.value === 'ta' && taText ? taText : enText;
  }
}
