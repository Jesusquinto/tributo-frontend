import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiRestService } from '@servicio';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';



@Component({
  selector: 'app-permisos',
  templateUrl: 'permisos.component.html',
  styleUrls: ['permisos.component.scss']
})
export class Permisos {


  public secciones: Array<any>;
  public permisoss: Array<any>;
  public codigo: string;
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });



  constructor(
    private servicio: ApiRestService,
    public dialogRef: MatDialogRef<Permisos>,
    @Inject(MAT_DIALOG_DATA) public data: any) {


    }

  onNoClick(): void {
    this.dialogRef.close();
  }


    cerrar(estado: number){
      this.data.estado = estado;
      this.dialogRef.close(this.data);
    }

    firmar() {
      this.servicio.post('firmar/' + this.data.tramite.idUsuarioActo + '/' + this.codigo , {}).subscribe(
        (result: any) => {
          this.Toast.fire({
            type: 'success',
            title: 'Genial!',
            text: result.mensaje
          });
          this.data.estado = 0;
          this.dialogRef.close(this.data);
        },
        (error: any) => {
          console.log(error);
          this.Toast.fire({
            type: 'error',
            title: 'Error!',
            text: error.error.mensaje
          });
         }
      );
    }

    guardar() {
      console.log(this.data.permisos);
      console.log(this.data.representante);
      this.data.representante.permisos = JSON.stringify(this.data.permisos);

      this.servicio.openSpinner();
      this.servicio.post('representantes/permisos', this.data.representante).subscribe(
        result => {this.servicio.closeSpinner(); console.log(result);
          this.Toast.fire({
            type: 'success',
            title: 'Genial!',
            text: 'Permisos actualizados'
          });this.cerrar(1); },
        error => {this.servicio.closeSpinner(); console.log(error)   }
      )


    }




}
