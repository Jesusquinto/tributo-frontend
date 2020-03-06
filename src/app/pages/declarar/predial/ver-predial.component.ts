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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ver-predial',
  templateUrl: './ver-predial.component.html',
  styleUrls: ['./ver-predial.component.scss'],
  providers : [DatePipe],
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
export class VerPredialComponent implements OnInit {

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
  @Output() Anular = new EventEmitter();

  public referencia: string;
  public direccion: string;
  public predios: any;


  public representado: any;
  public displayedColumns: string[] = [ 'referencia', 'nombre', 'direccion' , 'capital' , 'intereses', 'total'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selection = new SelectionModel<any>(true, []);
  public dataSource: any;
  public itemSelected: any;
  public items: Array<any> = [];
  public gindex: number;
  public doc: any;

  private nombre: string;
  public pdfRuta: string;

  public estado: string;

  constructor(public appSettings: AppSettings, private servicio: ApiRestService,
               private auth: AuthService,public dialog: MatDialog, public router: Router,
               private _representados: RepresentanteService, private date: DatePipe) {
                this.referencia = '';
                this.direccion = '';
                this.predios = null;
                this.dataSource = new MatTableDataSource<any>([]);
                this.estado = 'predios';
  }


  buscar() {
    const url: string = JSON.parse(this.acto.fkBcEntidad.urlPredial1).url;
    console.log(this.acto.fkBcEntidad.urlPredial1);
    this.servicio.openSpinner();
    this.servicio.serverPredial(url, `api/v1/estadocuenta/completo/resumen/${this.referencia}/${this.direccion}`).subscribe(
      (result: any) => {this.servicio.closeSpinner(), this.predios = result;
        this.dataSource = new MatTableDataSource<any>(result);
      },
      error => {this.servicio.closeSpinner(), console.log(error); }
    );
  }




  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gindex = null;
    this.itemSelected = null;

/*
    this.servicio.openSpinner();
    this.servicio.serverPredial(url, 'api/v1/contribuyentes/pages/0').subscribe(
      result => {console.log('RESULTADO: ',result); this.servicio.closeSpinner(); },
      error => {console.log(error), this.servicio.closeSpinner(); }
    ); */

    this._representados.representado.subscribe( value => this.representado = value);

  }


  pagar() {
    const url: string = JSON.parse(this.acto.fkBcEntidad.urlPredial1).url;

    const form: any = {
      refcatastral : this.predios[0].referencia,
      viginicial: 0,
      vigfinal: new Date().getFullYear(),
      vigactual: new Date().getFullYear(),
      fecharecibo: new Date(),
      usuario: 'tributo',
    };

    this.servicio.openSpinner();
    this.servicio.serverCrawler(url, 'api/v1/generar/recibo', form).subscribe(
      (recibo: any) => {
        console.log('difugeovikfpeogkfjbgple ',recibo);

        const fechav = String(this.date.transform(recibo.recibo.facItintTo, 'yyy'));
        const fecham = String(this.date.transform(recibo.recibo.facItintTo, 'mm'));
        const fechad = String(this.date.transform(recibo.recibo.facItintTo, 'dd'));
        const pk: any = recibo.recibo.documentodepagoindicoPK;
         this.servicio.serverPredial(url,
              `api/v1/reporte/recibo_pago/${form.refcatastral}/${pk.vgfcod}/${pk.facIcod}/${recibo.recibo.facIvlr}/${fechav}${fecham}${fechad}`).subscribe(
                (recibo: any) => {
                  this.nombre = recibo.ruta;
                  this.pdfRuta = `${url}api/v1/reporte/view/${recibo.ruta}`;
                  this.estado = 'verorden';
                },
                error => {console.log(error), this.servicio.closeSpinner(); }
              );
      },
      error => {console.log(error), this.servicio.closeSpinner(); }
    );
  }


  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  pdfCargado(e) {
    this.servicio.closeSpinner();
  }

  pdfError(e: any) {
    console.log(e);
    this.servicio.closeSpinner();
  }

  public savePDF() {
    FileSaver.saveAs(this.pdfRuta, this.nombre);
  }

}
