import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Chart from 'chart.js';
import { ShowPdfModal } from 'src/app/components/showPdfModal/showPdfModal.component';
import { ApiRestService } from '@servicio';
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

import { getOptions } from './data';
import { MatDialog } from '@angular/material';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public dataoptions: any;
  public data: any;
  private url: any;
  public options: any;
  public tipoEstadistica: any;
  public estadisticas: any;
  public TributosPorEntidadChart;
  public annoCtrl: any;
  public annoFilterCtrl: any;
  public annos: any;

  public resumen: any;


  constructor(private servicio: ApiRestService,  public dialog: MatDialog, private endpoints: EndpointsService, private router: Router) {
    this.annos = ['2018', '2019', '2020', '2021'];
    this.annoCtrl = this.annos[1];
    this.annoFilterCtrl = '';
    this.url = endpoints.endpoints.value;

    this.tipoEstadistica = 'PR';
    this.estadisticas = {};
    this.data = {
      labels: [],
      datasets: [{
        label: '',
        data: []
      },
    ]
  };
    }

  ngOnInit() {
    this.servicio.openSpinner();
    this.servicio.get('usuarioacto/estadisticas').subscribe(
      (estadisticas: any) => {this.servicio.closeSpinner(), console.log(estadisticas); this.getGraficas();
      estadisticas.forEach(e => {
        this.estadisticas[e[0]] = e[1];
      });
      console.log(this.estadisticas);
      },
      error => {this.servicio.closeSpinner(), console.log(error); }
    );



    const chartOrders = document.getElementById('chart-orders');
    parseOptions(Chart, chartOptions());


    const ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    this.getGraficas();
    this.getResumen();

  }


  getResumen() {
    this.servicio.openSpinner();
    this.servicio.get('usuarioacto/resumen').subscribe(
      resumen => {this.servicio.closeSpinner(), console.log(resumen), this.resumen = resumen;},
      error => {this.servicio.closeSpinner(), console.log(error)}
    );
  }



  getGraficas() {
    this.servicio.openSpinner();
    console.log(this.annoCtrl);
    this.servicio.get('usuarioacto/grafica/' + this.tipoEstadistica + '/' + this.annoCtrl).subscribe(
      (estadisticas: any) => {this.servicio.closeSpinner();
        let data: Array<any>;
        data = [];
        const dataSets = {
          labels: [],
          datasets: [{
            label: '',
            data: []
          },
        ]
      };
        switch (this.tipoEstadistica) {
          case 'PR':
            dataSets.datasets[0].label = 'Tributos sin pagar';
            break;
            case 'PA':
              dataSets.datasets[0].label = 'Tributos pagados';
              break;
        }
          estadisticas.forEach(e => {
            dataSets.labels.push(e[0].split('-')[1]);
            dataSets.datasets[0].data.push(e[2]);
            data.push({mes: e[0], valor: e[2], tramites: e[3], frecuente: e[4]});
          });


          this.data = dataSets;
          this.options = getOptions(data);


          console.log('data', this.data);
/*        this.TributosPorEntidadChart.data = dataSets;
          this.TributosPorEntidadChart.options = getOptions(data); */ 
      },
      error => {this.servicio.closeSpinner(), console.log(error); }
    );
  }



  verPdf(acto: any) {


    this.servicio.openSpinner();
    this.servicio.get(`reporte/estampillas/${acto.idUsuarioActo}`).subscribe(
      (path: any) => {
        this.servicio.closeSpinner();
        console.log(`${this.url.complete}tramite/ver/${path.ruta}`);
         const dialogRef = this.dialog.open(ShowPdfModal, {
          width: '60%',
          disableClose : true ,
          data: { 'tramite' : acto, 'ruta' : `${this.url.complete}tramite/ver/${path.ruta}`}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.estado === 0) {

            }
        });

      },
      error => {this.servicio.closeSpinner(); console.log( error); }
    );


  }

  goEstadoCuenta() {
    this.router.navigate(['/estado-cuenta']);
  }


}
