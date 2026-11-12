import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Interface pour les erreurs d'application
 */
export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  code?: string;
}

/**
 * Service centralisé pour la gestion globale des erreurs
 * Permet une gestion uniforme et cohérente des erreurs dans l'application
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<AppError>();
  public error$: Observable<AppError> = this.errorSubject.asObservable();

  /**
   * Afficher une erreur
   */
  showError(message: string, code?: string): void {
    this.emit(message, 'error', code);
  }

  /**
   * Afficher une notification de succès
   */
  showSuccess(message: string, code?: string): void {
    this.emit(message, 'success', code);
  }

  /**
   * Afficher une information
   */
  showInfo(message: string, code?: string): void {
    this.emit(message, 'info', code);
  }

  /**
   * Afficher un avertissement
   */
  showWarning(message: string, code?: string): void {
    this.emit(message, 'warning', code);
  }

  /**
   * Émettre une erreur
   */
  private emit(message: string, type: AppError['type'], code?: string): void {
    const appError: AppError = {
      message,
      type,
      timestamp: new Date(),
      code
    };

    console.log(`[${type.toUpperCase()}]`, message, code || '');
    this.errorSubject.next(appError);
  }
}
