import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiRestService } from 'src/app/api-rest.service';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-representados-modal',
  templateUrl: 'representadosModal.component.html',
  styleUrls: ['representadosModal.component.scss']
})
export class RepresentadosModal {

  public codigo: string;
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });



  constructor(
    public appSettings: AppSettings,
    private servicio: ApiRestService,
    public dialogRef: MatDialogRef<RepresentadosModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('representado', data.representado);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


    cerrar() {
      this.data.estado = 1;
      this.dialogRef.close(this.data);
    }


    aplicar() {
      this.data.estado = 0;
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
