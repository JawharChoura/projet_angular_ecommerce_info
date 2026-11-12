import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Collection de validateurs personnalisés pour les formulaires Angular
 */
export class CustomValidators {
  /**
   * Validateur pour vérifier que deux champs correspondent (ex: password et confirmPassword)
   * Usage: validators: [CustomValidators.match('password', 'confirmPassword')]
   */
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const mainControl = control.get(controlName);
      const matchingControl = control.get(matchingControlName);

      if (!mainControl || !matchingControl) {
        return null;
      }

      if (mainControl.value !== matchingControl.value) {
        matchingControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        const errors = matchingControl.errors;
        if (errors) {
          delete errors['mismatch'];
          matchingControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  /**
   * Validateur pour le format de numéro de téléphone
   * Accepte formats: +1 (123) 456-7890, 123-456-7890, etc.
   */
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return phoneRegex.test(control.value) ? null : { invalidPhone: true };
    };
  }

  /**
   * Validateur pour le format d'URL
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        new URL(control.value);
        return null;
      } catch {
        return { invalidUrl: true };
      }
    };
  }

  /**
   * Validateur pour vérifier que le prix est positif
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = Number(control.value);
      return value > 0 ? null : { positiveRequired: true };
    };
  }

  /**
   * Validateur pour vérifier la force du mot de passe
   * Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const password = control.value;
      const errors: ValidationErrors = {};

      if (password.length < 8) {
        errors['minLength'] = true;
      }
      if (!/[A-Z]/.test(password)) {
        errors['uppercase'] = true;
      }
      if (!/[a-z]/.test(password)) {
        errors['lowercase'] = true;
      }
      if (!/[0-9]/.test(password)) {
        errors['digit'] = true;
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors['special'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validateur asynchrone pour vérifier l'unicité de l'email
   * Évite que deux utilisateurs aient le même email
   */
  static emailUnique(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(authService.emailExists(control.value)).pipe(
        debounceTime(300),  // Attendre 300ms avant de vérifier
        map(exists => (exists ? { emailTaken: true } : null)),
        first()
      );
    };
  }

  /**
   * Validateur pour les codes alphanumériques
   */
  static alphanumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const alphanumericRegex = /^[a-zA-Z0-9]*$/;
      return alphanumericRegex.test(control.value) ? null : { notAlphanumeric: true };
    };
  }

  /**
   * Validateur pour les nombre entiers positifs
   */
  static integerPositive(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = Number(control.value);
      if (Number.isInteger(value) && value > 0) {
        return null;
      }

      return { integerPositive: true };
    };
  }
}
