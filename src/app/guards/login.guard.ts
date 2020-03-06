import {CanActivate, Router} from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
import { AuthService } from '@authService';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { ApiRestService } from '../api-rest.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, OnInit {

  constructor( private router: Router, private servicio: ApiRestService, private auth: AuthService) {
  }

  public usuario: any;

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      if (this.isTokenExpired()) {
        return true;
      }

      this.router.navigate(['/dashboard']);

      return false;
    }
    return true;
  }

isTokenExpired(): boolean {
  const token = this.auth.token;
  const payload = this.auth.obtenerDatosToken(token);
  const now = new Date().getTime() / 1000;
  if (payload.exp < now) {
    return true;
  }
  return false;
}
}

