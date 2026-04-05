import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly fb = new FormBuilder();
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);


  readonly isSignupMode = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  showPassword = signal(false);


  readonly form = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  toggleMode(): void {
    this.isSignupMode.update((value) => !value);
    this.errorMessage.set('');

    const fullNameControl = this.form.get('fullName');

    if (this.isSignupMode()) {
      fullNameControl?.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      fullNameControl?.clearValidators();
      fullNameControl?.setValue('');
    }

    fullNameControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.errorMessage.set('');

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    if (this.isSignupMode()) {
      this.authService
        .signup({
          fullName: this.form.get('fullName')?.value?.trim() ?? '',
          email: this.form.get('email')?.value?.trim() ?? '',
          password: this.form.get('password')?.value ?? ''
        })
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: () => {
            this.toast.success('account created successfully!!');
            this.redirectAfterAuth();
          },
          error: (err) => {
            const msg = err?.error?.error || 'signup failed Please try again.';
            this.errorMessage.set(msg);
            this.toast.error(msg);
          }
        });

      return;
    }

    this.authService
      .login({
        email: this.form.get('email')?.value?.trim() ?? '',
        password: this.form.get('password')?.value ?? ''
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Welcome back!');
          this.redirectAfterAuth();
        },
        error: (err) => {
          const msg = err?.error?.error || 'login failed Please check your credentials!';
          this.errorMessage.set(msg);
          this.toast.error(msg);
        }
      });
  }

  private redirectAfterAuth(): void {
    const role = this.authService.role();

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.router.navigate(['/groceries']);
  }
}
