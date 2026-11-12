import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Interface pour les notifications Toast
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Service centralisé pour afficher les notifications Toast
 * Permet une gestion uniforme des notifications dans l'application
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$: Observable<Toast> = this.toastSubject.asObservable();

  /**
   * Afficher une notification de succès
   */
  showSuccess(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Afficher une notification d'erreur
   */
  showError(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Afficher une notification d'information
   */
  showInfo(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Afficher une notification d'avertissement
   */
  showWarning(message: string, duration = 3000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Afficher une notification
   */
  private show(
    message: string,
    type: Toast['type'],
    duration: number
  ): void {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    this.toastSubject.next(toast);
  }
}
