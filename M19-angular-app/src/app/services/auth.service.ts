// src\app\services\auth.service.ts
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private validUsername = 'Mariam';
  private validPassword = 'Mariam';

  constructor(private router: Router) {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.token = savedToken;
    }
  }

  login(username: string, password: string): boolean {
      if (username === this.validUsername && password === this.validPassword) {
        // Mock JWT token (you would normally generate a real token here)
        this.token = 'mock-jwt-token';
        localStorage.setItem('authToken', this.token);  // Store token in localStorage
        return true;
      }
      return false;
    }
    isAuthenticated(): boolean {
      return this.token !== null || localStorage.getItem('authToken') !== null;
    }
    isLoggedIn(): boolean {
      return localStorage.getItem('authToken') !== null;
    }
    logout() {
      this.token = null;
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }

  }

