import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Entidad } from './modelos/entidad.model'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Endpoints } from './endpoints';


@Injectable({
  providedIn: 'root'
}) 
export class ApiRestService {

private url: any;
 private token = '';
 private httpOptions;
 
 constructor(private http: HttpClient)
 {
   this.url = Endpoints;
  this.getHeaders(); 
 }


 getHeaders(){
  this.token = sessionStorage.getItem('user');
  this.httpOptions = {headers: new HttpHeaders({  'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.token})};
 }

 getHeaders2(){
  this.token = sessionStorage.getItem('user');
  this.httpOptions = {headers: new HttpHeaders('multipart/*').append('Authorization', 'Bearer '+ this.token)};
 }


 
  get(ruta:string)
  {
    return this.http.get<any>(this.url.complete.concat(ruta),this.httpOptions);
  }

 post(ruta: string, body: any)
 {
     let repos = this.http.post<any>(this.url.complete.concat(ruta), body, this.httpOptions);
     return repos;
 }

 delete(ruta: string)
 {
     let repos = this.http.delete<any>(this.url.complete.concat(ruta), this.httpOptions);
     return repos;
 }

 put(ruta: string, body: any)
 { 
     let repos = this.http.put<any>(this.url.complete.concat(ruta), body, this.httpOptions);
     return repos;
 }


    googleLogin(){
    return this.url.normal.concat('oauth2/authorize/google?redirect_uri=http://localhost:4200/');    
 } 

 


 getUserData(){
  this.getHeaders(); 
  return this.http.get<any>(this.url.normal.concat('user/me'),this.httpOptions);
 }

 userIsLogged(){
  this.getHeaders();
  return this.http.get<any>(this.url.normal.concat('user/isLogged'), this.httpOptions);
 }


 setUsuarioActo(data: FormData){
  this.getHeaders2();
  return this.http.post(`${this.url.complete}acto/upload`, data, this.httpOptions);
 }


 




}