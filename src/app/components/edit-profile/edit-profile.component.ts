import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  editForm!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  profileImage: string | ArrayBuffer | null = null;
  imagePreview: string | null = null;
  showPasswordFields = false;
  showPasswordToggle = false;
  showConfirmPasswordToggle = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.populateForm();
    this.loadProfileImage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private populateForm(): void {
    if (this.currentUser) {
      this.editForm.patchValue({
        email: this.currentUser.email || ''
      });
    }
  }

  private loadProfileImage(): void {
    if (this.currentUser) {
      const savedImage = localStorage.getItem(`profile_image_${this.currentUser.id}`);
      if (savedImage) {
        this.imagePreview = savedImage;
      }
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image ne doit pas dépasser 5MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.profileImage = e.target.result;
        this.errorMessage = '';
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.profileImage = null;
  }

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    if (!this.showPasswordFields) {
      this.editForm.get('currentPassword')?.reset();
      this.editForm.get('newPassword')?.reset();
      this.editForm.get('confirmPassword')?.reset();
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPasswordToggle = !this.showPasswordToggle;
    } else if (field === 'confirm') {
      this.showConfirmPasswordToggle = !this.showConfirmPasswordToggle;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    // Vérifier que le mot de passe courant est fourni si l'utilisateur change de mot de passe
    if (this.showPasswordFields && !this.editForm.get('currentPassword')?.value) {
      this.errorMessage = 'Le mot de passe courant est requis pour modifier le mot de passe';
      return;
    }

    this.loading = true;
    const updatedUser: any = {
      ...this.currentUser,
      email: this.editForm.get('email')?.value
    };

    // Mettre à jour le mot de passe si nécessaire
    if (this.showPasswordFields && this.editForm.get('newPassword')?.value) {
      updatedUser.password = this.editForm.get('newPassword')?.value;
    }

    // Sauvegarder l'image de profil
    if (this.profileImage && this.currentUser) {
      localStorage.setItem(`profile_image_${this.currentUser.id}`, this.profileImage as string);
    }

    // Simuler l'appel API
    setTimeout(() => {
      this.authService.updateUser(updatedUser);
      this.currentUser = updatedUser;
      this.loading = false;
      this.successMessage = 'Profil mis à jour avec succès!';
      this.submitted = false;
      this.showPasswordFields = false;
      
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  get f() {
    return this.editForm.controls;
  }
}
