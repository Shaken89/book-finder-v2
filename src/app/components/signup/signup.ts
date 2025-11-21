import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    const email = this.email.trim();
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();

    if (!email || !password || !confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Используем подписку на Observable от AuthService
    this.authService.signup(email, password).pipe(
      catchError(err => {
        const code = err?.code ?? '';
        this.errorMessage = this.getErrorMessage(code);
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(userCredential => {
      if (userCredential) {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      }
    });
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'Signup failed. Please try again.';
    }
  }
}
