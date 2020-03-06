import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiRestService } from 'src/app/api-rest.service';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import Swal from 'sweetalert2';
import { RepresentanteService } from '@representados';

@Component({
  selector: 'app-llave-modal',
  templateUrl: 'llaveModal.component.html',
})
export class LlaveModal {

  public representado: any;

  private settings : Settings;
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
    public dialogRef: MatDialogRef<LlaveModal>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _representados: RepresentanteService) {
      this.settings = appSettings.settings;
      this._representados.representado.subscribe( value => this.representado = value);
      console.log(this.data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


    cerrar() {
      this.data.estado = 1;
      this.dialogRef.close(this.data);
    }

    firmar() {
      const data = {
        so : navigator.appVersion.split('(')[1].split(')')[0],
        navegador : this.getBrowserInfo()
      };

      switch (this.representado) {
        case null:
          switch (this.data.tramite.fkActoEntidad.fkBcActo.tipo) {
            case 'ICA':
              this.llaveIca(data);
              break;
            case 'EST':
              this.llaveEst(data);
              break;
          }
          break;
        default:
          this.servicio.openSpinner();
          this.servicio.post(`firmar/representado/${this.data.tramite.idUsuarioActo}/${this.codigo}` , data).subscribe(
            (result: any) => {
              this.servicio.closeSpinner();
              this.Toast.fire({
                type: 'success',
                title: 'Genial!',
                text: result.mensaje
              });
              this.data.estado = 0;
              this.dialogRef.close(this.data);
            },
            (error: any) => {
              this.servicio.closeSpinner();
              console.log(error);
              this.Toast.fire({
                type: 'error',
                title: 'Error!',
                text: error.error.mensaje
              });
            }
          );
          break;
      }
    }


      llaveEst(data: any) {
        this.servicio.openSpinner();
        this.servicio.post(`firmar/${this.data.tramite.idUsuarioActo}/${this.codigo}` , data).subscribe(
          (result: any) => {
            this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'success',
              title: 'Genial!',
              text: result.mensaje
            });
            this.data.estado = 0;
            this.dialogRef.close(this.data);
          },
          (error: any) => {
            this.servicio.closeSpinner();
            console.log(error);
            this.Toast.fire({
              type: 'error',
              title: 'Error!',
              text: error.error.mensaje
            });
          }
        );
      }


      llaveIca(data: any) {
        this.servicio.openSpinner();
        this.servicio.post(`firmarica/${this.data.tramite.idUsuarioActo}/${this.codigo}` , data).subscribe(
          (result: any) => {
            this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'success',
              title: 'Genial!',
              text: result.mensaje
            });
            this.data.estado = 0;
            this.dialogRef.close(this.data);
          },
          (error: any) => {
            this.servicio.closeSpinner();
            console.log(error);
            this.Toast.fire({
              type: 'error',
              title: 'Error!',
              text: error.error.mensaje
            });
          }
        );
      }


      getBrowserInfo() {
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
      }
}
