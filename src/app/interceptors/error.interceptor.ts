import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Intercepteur HTTP global pour la gestion centralisée des erreurs
 * S'applique à toutes les requêtes HTTP de l'application
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error);
        console.error('[HTTP Error]', errorMessage, error);

        // Afficher l'erreur à l'utilisateur
        this.displayErrorMessage(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Formater le message d'erreur HTTP
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Erreur client
      return `Erreur: ${error.error.message}`;
    }

    // Erreur serveur - gérer différents codes HTTP
    switch (error.status) {
      case 0:
        return 'Erreur de connexion. Vérifiez votre connexion Internet.';
      case 400:
        return `Requête invalide: ${error.error?.message || error.statusText}`;
      case 401:
        return 'Authentification requise. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Vous n\'avez pas les permissions.';
      case 404:
        return 'Ressource non trouvée (404).';
      case 409:
        return 'Conflit: données en conflit ou déjà existantes.';
      case 500:
        return 'Erreur serveur interne (500).';
      case 503:
        return 'Service indisponible. Réessayez plus tard.';
      default:
        return `Erreur serveur: ${error.status} ${error.statusText}`;
    }
  }

  /**
   * Afficher un message d'erreur à l'utilisateur
   * Peut être remplacé par un service Toast dans le futur
   */
  private displayErrorMessage(message: string): void {
    // TODO: Implémenter une notification Toast au lieu d'alert
    console.warn('[ERROR DISPLAY]', message);
    // alert(message);  // Éviter les alerts - utiliser un service Toast
  }
}
