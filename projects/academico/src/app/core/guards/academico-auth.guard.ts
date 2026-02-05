import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AcademicoAuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): boolean {
    return this.ensureAuthenticated();
  }

  canActivateChild(): boolean {
    return this.ensureAuthenticated();
  }

  private ensureAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedin') === 'true';
    const userId = localStorage.getItem('Id_Usuario');
    const companyId = localStorage.getItem('Id_Empresa');
    if (isLoggedIn && userId && companyId) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
