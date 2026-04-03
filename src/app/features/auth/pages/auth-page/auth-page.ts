import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly fb = new FormBuilder();

  readonly isSignupMode = signal(false);
  readonly pageTitle = computed(() =>
    this.isSignupMode() ? 'Create your account' : 'Welcome back'
  );
  readonly submitLabel = computed(() =>
    this.isSignupMode() ? 'Sign Up' : 'Login'
  );

  readonly form = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode(): void {
    this.isSignupMode.update((value) => !value);

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

    if (this.form.invalid) {
      return;
    }
  }
}
