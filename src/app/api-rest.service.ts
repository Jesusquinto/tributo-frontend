import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { AuthService } from '@authService';
import { Router } from '@angular/router';
import { EndpointsService } from './services/endpoints.service';
@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

 private url: any;
 private token = '';
 private httpOptions;

 constructor(private http: HttpClient,
             private spinner: NgxSpinnerService,
             private auth: AuthService,
             private router: Router,
             private endpointsService: EndpointsService) {
    this.url = this.endpointsService.endpoints.value;
    this.getHeaders();

 }


 getHeaders() {
  this.token = sessionStorage.getItem('token');
  this.httpOptions = {headers: new HttpHeaders({  'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.token})};
 }

 getHeaders2() {
  this.token = sessionStorage.getItem('token');
  this.httpOptions = {headers: new HttpHeaders('multipart/*').append('Authorization', 'Bearer ' + this.token)};
 }

 getHeaders3() {
   this.httpOptions = {headers: new HttpHeaders({  'Content-Type': 'application/json' })};
 }

 clearSession() {
  this.auth.logout();
  swal.fire({
    title: 'Error!',
    text: 'Su sesion ha expirado',
    type: 'error'
  });
  this.spinner.hide();
  this.router.navigate(['/login']);
 }



  get(ruta: string) {
    if (this.auth.isAuthenticated()) {
      const exp = this.auth.isTokenExpired();
      if (!exp) {
        this.getHeaders();
        return this.http.get<any>(this.url.complete.concat(ruta), this.httpOptions);
      }
    }
    this.clearSession();
  }

 post(ruta: string, body: any) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders();

      return this.http.post<any>(this.url.complete.concat(ruta), body, this.httpOptions);
    }
  }
  this.clearSession();
 }

 delete(ruta: string) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders();
      return this.http.delete<any>(this.url.complete.concat(ruta), this.httpOptions);
    }
  }
  this.clearSession();
 }

 put(ruta: string, body: any) {
  if ( this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders();
      return this.http.put<any>(this.url.complete.concat(ruta), body, this.httpOptions);
    }
  }
  this.clearSession();
 }

 localLogin(data: any) {
   this.getHeaders();
   return this.http.post<any>(this.url.normal.concat('auth/login'), data , this.httpOptions);
 }

 localRegister(data: any) {
   this.getHeaders();
   return this.http.post<any>(this.url.normal.concat('auth/signup'), data, this.httpOptions);
 }

 verify(code: string) {
   this.getHeaders();
   return this.http.get<any>(this.url.normal.concat('auth/verificar/'.concat(code)), this.httpOptions);
 }

 confirmarInvitacion(clave: string) {
  this.getHeaders3();
  return this.http.get<any>(this.url.complete.concat('representantes/confirmar/'.concat(clave)), this.httpOptions);
 }


 getUserData() {
    if (this.auth.isAuthenticated()) {
      const exp = this.auth.isTokenExpired();
      if (!exp) {
        this.getHeaders();
        return this.http.get<any>(this.url.normal.concat('user/me'), this.httpOptions);
      }
    }
    this.clearSession();
 }



 newActo(data: FormData) {
    if (this.auth.isAuthenticated()) {
      const exp = this.auth.isTokenExpired();
      if (!exp) {
        this.getHeaders2();
        return this.http.post(`${this.url.complete}acto/new`, data, this.httpOptions);
      }
    }
    this.clearSession();
 }

serverPredial(serverUrl: string, ruta: string) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders2();
      return this.http.get(`${serverUrl}${ruta}`, this.httpOptions);
    }
  }
  this.clearSession();
}

serverCrawler(serverUrl: string, ruta: string, form: FormData) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders2();
      return this.http.post(`${serverUrl}${ruta}`, form, this.httpOptions);
    }
  }
  this.clearSession();
}


 newActoRepresentado(data: FormData, idUsuario: any) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      this.getHeaders2();
      return this.http.post(`${this.url.complete}acto/representado/new/${idUsuario}`, data, this.httpOptions);
    }
  }
  this.clearSession();
}


consultarPlaca(placa: string) {
  if (this.auth.isAuthenticated()) {
    const exp = this.auth.isTokenExpired();
    if (!exp) {
      let headers = new HttpHeaders();
      headers = headers.set('Accept', 'application/pdf' );
      headers.set('Access-Control-Allow-Origin', '*');
      return this.http.get(`http://aplicaciones.atlantico.gov.co:8080/wscontroller/webresources/documentos/declaracion?placa=${placa}`
      , { headers: headers, responseType: 'blob' });
    }
  }
  this.clearSession();
}





 openSpinner() {
  this.spinner.show();
 }

 closeSpinner() {
  this.spinner.hide();
 }


}
