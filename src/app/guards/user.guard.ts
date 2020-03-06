import {CanActivate, Router} from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
import { AuthService } from '@authService';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { ApiRestService } from '../api-rest.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate, OnInit {

  constructor(private servicio: ApiRestService, private router: Router, private auth: AuthService) {
  }

  public usuario: any;


  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isAuthenticated()) {
      if (this.isTokenExpired()) {
        this.auth.logout();
        this.router.navigate(['/login']);
        return false;
      }
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }






  isTokenExpired(): boolean {
    const token = sessionStorage.getItem('token');
    const payload = this.auth.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }
}