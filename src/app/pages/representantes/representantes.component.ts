import { Component, OnInit } from '@angular/core';
import { ApiRestService } from '@servicio';
import { AuthService } from '@authService';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { AgregarModal } from './agregar-modal/agregar-modal.component';
import { Permisos } from './permisos/permisos.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tables',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.scss']
})
export class RepresentantesComponent implements OnInit {
  public estado: string;
  public bloqueFilter: string;
  public identificacion: string;
  public secciones: Array<any>;
  public usuarios: any;

  public representantes: Array<any>;

  public prueba: Array<any>;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });


  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
      title: 'title2'
    },
    buttonsStyling: false,
  });

  constructor(private servicio: ApiRestService, public dialog: MatDialog) {
    this.usuarios = [];
    this.representantes = [];
    this.estado = 'agregar';
    this.bloqueFilter = '';
    }


  ngOnInit() {
    this.getRepresentantes();
  }




  agregar(usuario: any): void {
    const dialogRef = this.dialog.open(AgregarModal, {
      width: '450px',
      disableClose : true ,
      data: { usuario : usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      switch (result.estado) {
        case 0:
          console.log('cerrar');
          break;
        case 1:
          this.getRepresentantes();
      }
    });
  }


  verPermisos(representante: any): void {

    console.log('representante', representante);


    this.servicio.openSpinner();
    this.servicio.get('secciones/list').subscribe(
      (result: any) => {this.servicio.closeSpinner();
        const secciones: Array<any> = [];
          result.forEach(e => {
            let seccion: any;
            seccion = JSON.parse(e.seccion);
            secciones.push(seccion);
          });
          this.secciones = secciones;
          let data: Array<any>;
          data = [];
          // VER SI LOS REPRESENTANTES YA TIENEN PERMISOS AGREGADOS
          representante.permisos.forEach(p => {
            if (this.secciones.some(s => s.titulo === p.titulo)) {
              data.push(p);
            }
          });

          // AGREGAR PERMISOS SI NO TIENEN
          this.secciones.forEach(s => {
            if (!data.some(d => d.titulo === s.titulo)) {
              data.push({
                  activo : false,
                   titulo : s.titulo,
                   permisos : this.formatPermisos(s.permisos),
                   bloque: s.bloque,
                   detalles: false
              });
            }
          });

        console.log('datos', data);

        const dialogRef = this.dialog.open(Permisos, {
          width: '450px',
          disableClose : true ,
          data: { representante : representante, permisos: data }
        });
        dialogRef.afterClosed().subscribe(res => {
          console.log(res);
          switch (res.estado) {
            case 0:
              console.log('cerrar');
              break;
            case 1:
              this.getRepresentantes();
          }
        });
      },
      error => {this.servicio.closeSpinner(); console.log(error); }
    );


  }




  getRepresentantes() {
    console.log('representantes');
    this.servicio.openSpinner();
    this.servicio.get('representantes/usuario').subscribe(
      (representantes: any) => {this.servicio.closeSpinner(); console.log(representantes); 
        representantes.forEach(r => {
          console.log(r.permisos);
            r.permisos = JSON.parse(r.permisos);
        });

        this.representantes = representantes;
        console.log(this.representantes);
        console.log('representantes', this.representantes);
      console.log(this.representantes)},
      error => {this.servicio.closeSpinner(); console.log(error)}
    );
  }


  remover(representante) {

    this.swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: 'De remover al representante '.concat(representante.cuentaRepresentante.name).concat(' ?'),
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this.servicio.openSpinner();
        this.servicio.put('representantes/remover/'.concat(representante.id), null).subscribe(
          resultado => { this.getRepresentantes(); 
            this.Toast.fire({
              type: 'success',
              title: 'Exito!',
              text: 'Tramite Anulado'
            });
          },
          error => {this.servicio.closeSpinner(); console.log(error);}
        );
      } else {}
    });





  }


  formatPermisos(permisos: any): Array<any> {
    let pe: Array<any>;
    pe = [];
    permisos.forEach(p => {
      pe.push({
        nombre: p,
        valor: false
      });
    });
    return pe;
  }




  getUsuario() {
    this.servicio.openSpinner();
    this.servicio.get('frusuarios/identificacion/'.concat(this.identificacion)).subscribe(
      result => {this.servicio.closeSpinner(); this.usuarios = result; console.log(result);},
      error => {this.servicio.closeSpinner(), console.log(error); }
    );
  }




}
