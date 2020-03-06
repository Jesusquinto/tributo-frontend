import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiRestService } from '@servicio';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-agregar-modal',
  templateUrl: 'agregar-modal.component.html',
})
export class AgregarModal {

  public formulario: FormGroup;
  public codigo: string;
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });



  constructor(
    private _formBuilder: FormBuilder,
    private servicio: ApiRestService,
    public dialogRef: MatDialogRef<AgregarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formulario = this._formBuilder.group({
        'tipoActividad': ['', Validators.compose([Validators.required])],
        'nombreEstablecimiento': ['', Validators.compose([Validators.required])],
      });

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  agregar() {
    if (this.formulario.valid) {
      const representante: any = {...this.formulario.value};
      representante.cuentaRepresentante = this.data.usuario;
      this.servicio.openSpinner();
      this.servicio.post('representantes/new', representante).subscribe(
        result => {
          this.servicio.closeSpinner(), console.log(result);
          this.Toast.fire({
            type: 'success',
            title: 'Genial!',
            text: 'ha invitado al contribuyente con exito!'
          });
          this.cerrar(1);
        },
        error => {this.servicio.closeSpinner(), console.log(error);
          this.Toast.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ocurrió un eror al invitar al contribuyente!'
          });
        }
      );
      console.log(representante);
    }
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
      ); }
}
