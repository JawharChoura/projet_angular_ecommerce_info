import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'ar';

export interface UiLanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'preferredLanguage';
  private readonly defaultLanguage: SupportedLanguage = 'fr';
  private readonly languageOptions: UiLanguageOption[] = [
    { code: 'fr', label: 'French', nativeLabel: 'Francais' },
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'es', label: 'Spanish', nativeLabel: 'Espanol' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' }
  ];

  private activeLanguageSubject = new BehaviorSubject<SupportedLanguage>(this.getInitialLanguage());
  activeLanguage$ = this.activeLanguageSubject.asObservable();

  getLanguageOptions(): UiLanguageOption[] {
    return this.languageOptions;
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.activeLanguageSubject.value;
  }

  setLanguage(language: SupportedLanguage): void {
    if (!this.isSupported(language)) {
      return;
    }

    this.activeLanguageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
  }

  private getInitialLanguage(): SupportedLanguage {
    const storedLanguage = localStorage.getItem(this.storageKey);

    if (storedLanguage && this.isSupported(storedLanguage)) {
      return storedLanguage;
    }

    return this.defaultLanguage;
  }

  private isSupported(language: string): language is SupportedLanguage {
    return this.languageOptions.some(option => option.code === language);
  }
}
