import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiRestService } from 'src/app/api-rest.service';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import Swal from 'sweetalert2';
import { RepresentanteService } from '@representados';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-show-pdf-modal',
  templateUrl: 'showPdfModal.component.html',
})
export class ShowPdfModal {

  public representado: any;
  public url: string;

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
    public dialogRef: MatDialogRef<ShowPdfModal>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _representados: RepresentanteService) {
      this.settings = appSettings.settings;
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }




    cerrar() {
      this.data.estado = 1;
      this.dialogRef.close(this.data);
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



      public savePDF() {
        FileSaver.saveAs(this.data.ruta);
      }



      pdfCargado(e) {
        this.servicio.closeSpinner();
        console.log(this.data);
        console.log('se cargó');
      }
}
