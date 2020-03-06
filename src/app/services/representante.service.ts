import { Injectable } from '@angular/core';

import { share, startWith } from 'rxjs/operators';
import { Observable, BehaviorSubject, Operator} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
     providedIn: 'root'
   })
export class RepresentanteService{

     public representados: BehaviorSubject<any>  = new BehaviorSubject<any>([]);
     public representado: BehaviorSubject<any> = new BehaviorSubject<any>(null);




     constructor(private ruta: Router) { 
          this.representado.subscribe(result => {
               this.ruta.navigate(['dashboard']);
          });
     }

     setRepresentados(representados: any) {
          this.representados.next(representados);
     }

     setRepresentado(representado: any) {
          this.representado.next(representado);
     }



          // tipo 0 = modulo
          // tipo 1 = permisos
     permiso(tipo: number, nombre: any): boolean {
          let permisos: Array<any>;
          switch (tipo) {
             case 0:
               permisos = JSON.parse(this.representado.value.permisos);
               if (permisos.find(p => p.bloque === nombre).activo) {
                    return true;
               } else {
                    return false;
               }
                    break;
             case 1:
                  console.log(this.representado.value)
                    permisos  = JSON.parse(this.representado.value.permisos);
                    permisos = permisos.find(p => p.bloque === nombre.modulo).permisos;
                    if (permisos.find(p => p.nombre === nombre.nombre).valor) {
                         return true;
                    } else {
                         return false;
                    }
                    break;
          }
          return false;
     }




}