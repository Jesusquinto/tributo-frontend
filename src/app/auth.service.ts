import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  /* tslint:disable-next-line: variable-name */
  public _usuario: Usuario;
  /* tslint:disable-next-line: variable-name */
  public _token: string;

  constructor(private http: HttpClient, private router: Router) { }

  public get usuario(): Usuario {
    if ( this._usuario !== null ) {
      return this._usuario;
    } else if ( this._usuario === null && sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if ( this._token != null ) {
      return this._token;
    } else if ( this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
  }


  isTokenExpired(): boolean {
    const token = sessionStorage.getItem('token');
    const payload = this.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }


  /* tslint:disable-next-line: variable-name */
  guardarUsuario( access_token: string): void {
    // tslint:disable-next-line: prefer-const
    this._token = access_token;
    sessionStorage.setItem('token', access_token);
    const payload = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.idUsuario = payload.idUsuario;
    this._usuario.name = payload.name;
    this._usuario.celular = payload.celular;
    this._usuario.direccion = payload.direccion;
    this._usuario.fkDivipo = payload.fkDivipo;
    this._usuario.identificacion = payload.identificacion;
    this._usuario.tipoIdentificacion  = payload.tipoIdentificacion;
    this._usuario.tipoContribuyente = payload.tipoContribuyente;
    this._usuario.razonSocial = payload.razonSocial;
    this._usuario.usuario = payload.usuario;
    this._usuario.telefono = payload.telefono;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }


  /* tslint:disable-next-line: variable-name */
  obtenerDatosToken( access_token: string): any {
    if (access_token != null) {
      return JSON.parse(atob(access_token.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    // tslint:disable-next-line: prefer-const
    let token = sessionStorage.getItem('token');
    const payload = this.obtenerDatosToken(token);
    if (payload != null && payload.email && payload.email.length > 0) {
      return true;
    }
    return false;
  }

/*   hasRole(role: any): boolean {
    if (this.usuario != null && this.usuario.roles != null && this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  } */

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  obtenerDatosUser() {
    if ( sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }


}