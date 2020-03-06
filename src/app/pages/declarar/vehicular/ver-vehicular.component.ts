import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import Swal from 'sweetalert2';
import { ApiRestService } from '../../../api-rest.service';
import {MatDialog, } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@authService';
import { RepresentanteService } from '@representados';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as FileSaver from 'file-saver';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-ver-vehicular',
  templateUrl: './ver-vehicular.component.html',
  styleUrls: ['./ver-vehicular.component.scss'],
  animations: [
      trigger(
        'enterAnimation', [
          transition(':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
          ]),
          transition(':leave', [
            style({ transform: 'translateX(0)', opacity: 1 }),
            animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
          ])
        ]
      )
  ]
})
export class VerVehicularComponent implements OnInit {

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
      title: 'title2'
    },
    buttonsStyling: false,
  });


  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  @Input() public acto: any;
  @Input() public tributos: any;
  @Input() public tramite: any;

  public placa: string;
  public estado: string;

  public url: any;

  constructor(public appSettings: AppSettings, private servicio: ApiRestService,
               private auth: AuthService, public dialog: MatDialog, public router: Router,
               private _representados: RepresentanteService, private sanitizer: DomSanitizer) {
                this.estado = 'buscar';
  }


  buscar() {

    this.servicio.openSpinner();
   this.estado = 'verpdf'; 
    this.url = `http://aplicaciones.atlantico.gov.co:8080/wscontroller/webresources/documentos/declaracion?placa=${this.placa}`;
    this.url =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
     

/*     this.servicio.consultarPlaca(this.placa).subscribe(
      result => {this.servicio.closeSpinner();
        console.log(result);
      },
      error => {this.servicio.closeSpinner(), console.log(error); }
    ); */
  }




  ngOnInit() {


/*
    this.servicio.openSpinner();
    this.servicio.serverVehicular(url, 'api/v1/contribuyentes/pages/0').subscribe(
      result => {console.log('RESULTADO: ',result); this.servicio.closeSpinner(); },
      error => {console.log(error), this.servicio.closeSpinner(); }
    ); */

  
  }


 


  pdfCargado(e) {
    this.servicio.closeSpinner();
  }

  pdfError(e: any) {
    console.log(e);
    this.servicio.closeSpinner();
  }

/*   public savePDF() {
    FileSaver.saveAs(this.pdfRuta, this.nombre);
  } */

}
