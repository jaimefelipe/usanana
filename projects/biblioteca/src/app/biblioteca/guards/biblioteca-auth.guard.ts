import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaAuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): boolean {
    return this.ensureAuthenticated();
  }

  canActivateChild(): boolean {
    return this.ensureAuthenticated();
  }

  private ensureAuthenticated(): boolean {
    if (localStorage.getItem('isLoggedin') === 'true') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
