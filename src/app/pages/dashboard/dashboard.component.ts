import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

import { data,data2, options, options2 } from './data';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;

  public dataoptions: any;
  public data: any; 

  public TributosPorEntidadChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public settings: Settings;
  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = true;
  }

  ngOnInit() {

   
    this.datasets =  {data: data, options: options, data2: data2, options2 : options2};
    this.data = this.datasets.data;
    this.dataoptions = this.datasets.options;

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartTributosPorEntidad = document.getElementById('chart-sales');
    this.TributosPorEntidadChart = new Chart(chartTributosPorEntidad, {
      type: 'line',
      options: this.dataoptions,
      data: this.data
    });
    console.log(this.datasets);
    console.log(this.TributosPorEntidadChart.data);

  }
  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }




  public updateOptions() {
    this.TributosPorEntidadChart.data = this.data;
    this.TributosPorEntidadChart.options = this.dataoptions;
    this.TributosPorEntidadChart.update();
  }

}
