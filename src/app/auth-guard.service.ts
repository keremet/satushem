import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      if (state.url.startsWith('/profile')) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      if (state.url.startsWith('/profile')) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    }
  }
}
