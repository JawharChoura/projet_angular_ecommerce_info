import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { name, email, password } = this.registerForm.value;

    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      password,
      role: 'client'
    };

    if (this.authService.emailExists(email)) {
      this.errorMessage = 'Cet email est déjà utilisé';
      this.loading = false;
      return;
    }

    this.authService.registerUser(newUser);
    this.successMessage = 'Compte créé avec succès! Redirection vers la connexion...';
    
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/login']);
    }, 2000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
