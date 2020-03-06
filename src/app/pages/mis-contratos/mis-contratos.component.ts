import { Component, OnInit } from '@angular/core';
import { ApiRestService } from '@servicio';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { trigger, style, transition, animate } from '@angular/animations';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-maps',
  templateUrl: './mis-contratos.component.html',
  styleUrls: ['./mis-contratos.component.scss'],
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
  ],
})
export class MisContratosComponent implements OnInit {
  public contratos: any;
  public pdfRuta: any;
  public numeroContrato: any;
  public valorContrato: number;
  private endpoint: any;
  public contrato: any;
  public estado: string;



  constructor(private servicio: ApiRestService, private endpoitns: EndpointsService) {
    this.endpoint = endpoitns.endpoints.value;
    this.numeroContrato = '';
    this.valorContrato = 0;
    this.estado = 'vercontratos';
  }

  ngOnInit() {
    this.getContratos();
  }

  getContratos() {
    this.servicio.openSpinner();
    this.servicio.get('contratos/usuario').subscribe(
      (contratos: any) => {
        console.log(contratos);
        this.contratos = contratos;
        this.servicio.closeSpinner();
      },
      (error) => {
        console.log(error);
        this.servicio.closeSpinner();
      });
  }


  verContrato(tramite: any) {

    if (tramite.pdfRuta != null) {
      this.servicio.openSpinner();
      this.pdfRuta = `${this.endpoint.complete}contrato/ver/${tramite.pdfRuta}`;
      console.log('RUTA', this.pdfRuta);
      this.estado = 'verpdf';
      this.contrato = tramite;
    }


  }

  pdfCargado(e: any) {
    console.log('se cargó');
    this.servicio.closeSpinner();
  }


  pdfError(e: any) {
    console.log('error');
    this.servicio.closeSpinner();
  }



  buscarContratos(tipo: number) {

    let numero = '0';
    let valor = 0;

    if (this.numeroContrato !== '' && this.numeroContrato != null) {
        numero = this.numeroContrato;
    }


    if (this.valorContrato > 0) {
      valor = this.valorContrato;
    }


    switch (tipo) {
      case 0:
        numero = '0';
        valor = 0;
        this.numeroContrato = '';
        this.valorContrato = 0;
        break;
    }

  this.servicio.openSpinner();
  this.servicio.get(`contratos/filter/${numero}/${valor}`).subscribe(
    (contratos: any) => {
      this.contratos = contratos;
      this.servicio.closeSpinner();
    },
    error => {
      console.log(error);
      this.servicio.closeSpinner();
    }
  );
  }


  public savePDF() {
    FileSaver.saveAs(this.pdfRuta);
  }


}
