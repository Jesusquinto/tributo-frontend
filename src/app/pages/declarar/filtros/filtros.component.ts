import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettings } from '../../../app.settings';

//MODELS
import { Settings } from '../../../app.settings.model';

import Swal from 'sweetalert2';
import { divipos } from '../../../modelos/geDivipo.data';

import { ApiRestService } from '../../../api-rest.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {
  public ubicaciones: any;

  public departamentos: any = new Array();
  public municipios: any = new Array();

  private ResetTramitesFilter: any


  @Input()
  public idEntidad: any;


  @Input()
  public actos: any;

  @Input()
  public resultados: any = 0;

  @Input()
  public estado: string = 'verentidades';



  public municipioSelected: string = null;
  public departamentoSelected: string = null;
  public departamentoSearch: string = '';
  public municipioSearch: string = '';


  public nameTramite: string = null;
  public code: number = null;


  @Output() showEntidades = new EventEmitter();
  mostrarEntidades(entidades: any) {
    this.showEntidades.emit(entidades);
  }


  @Input() resetTramitesFilter: Observable<void>;
  @Input() resetEntidadesFilter: Observable<void>;



  @Output() showTramites = new EventEmitter();
  mostrarTramites(tramites: any) {
    this.showTramites.emit(tramites);
  }

  public filtros: any = [
    { "type": 'name', "value": null },
    { "type": 'departamento', "value": null },
    { "type": 'municipio', "value": null },
  ]


  public filtrosTramites: any = [
    { "type": 'code', "value": null },
    { "type": 'name', "value": null },

  ]

  public settings: Settings;
  constructor(public appSettings: AppSettings, private servicio: ApiRestService) {
    this.ubicaciones = divipos;
    this.getDepartamentos();


    console.log(this.departamentos);
    console.log(this.municipios);
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;
  }

  ngOnInit() {



    this.resetEntidadesFilter.subscribe(() =>{
      this. municipioSelected = null;
      this.departamentoSelected = null;
      this.departamentoSearch = '';
      this.municipioSearch = '';
      

      this.filtros = [
        { "type": 'name', "value": null },
        { "type": 'departamento', "value": null },
        { "type": 'municipio', "value": null },
      ]
      this.mostrarEntidades(null);
    });




     this.resetTramitesFilter.subscribe(() => {
      this.nameTramite = null;
      this.code = null;
      this.filtrosTramites = [
        { "type": 'code', "value": null },
        { "type": 'name', "value": null },
      ]
    })


  }


  removeFiltro(i: any) {
    console.log(i);
    if (this.filtros[i].type == 'departamento') {
      this.departamentoSelected = null;
      this.municipioSelected = null;
      this.filtros[2].value = null;
    }

    if (this.filtros[i].type == 'municipio') {
      this.municipioSelected = null;
    }
    this.filtros[i].value = null;

    this.filtrar();
  }

  removeFiltroTramites(i: any) {
    this.filtrosTramites[i].value = null;
    switch (this.filtrosTramites[i].type) {
      case 'code':
        this.code = null;
        break;
      case 'name':
        this.nameTramite = null;
      default:
        break;
    }
    this.filtrarTramites();
  }


  seleccionarDepartamento(departamento: any) {
    this.filtros[1].value = null;
    this.filtros[1].value = departamento.nombreDepartamentp;

    this.filtros[2].value = null;

    this.departamentoSearch = departamento.nombreDepartamentp;
    this.getMunicipiosByDepartamento(departamento);
    console.log(this.departamentoSearch);
    this.filtrar();
  }

  seleccionarMunicipio(municipio: any) {
    this.filtros[2].value = null;
    this.filtros[2].value = municipio.nombreMunicipio;

    this.municipioSearch = municipio.nombreMunicipio;
    console.log(this.municipioSearch);
    this.filtrar();

  }


  seleccionarCode() {
    if(this.code != null){
      this.filtrosTramites[0].value = null;
      this.filtrosTramites[0].value = this.code
      if (this.nameTramite != null) {
        this.filtrosTramites[1].value = null;
        this.filtrosTramites[1].value = this.nameTramite;
      }
  
  
  
      this.filtrarTramites();

    }

   
  }




  seleccionarName() {
    if(this.nameTramite !=null){
      this.filtrosTramites[1].value = null;
      this.filtrosTramites[1].value = this.nameTramite;
      if (this.code != null) {
        this.filtrosTramites[0].value = null;
        this.filtrosTramites[0].value = this.code
      }
      this.filtrarTramites();
    }
  
  }





  filtrarTramites() {
    let code = '0'
    let name = '0'

    console.log(this.nameTramite);
    console.log(this.code)
    if (this.code != null) {
      code = this.code.toString();
    }
    if (this.nameTramite != null) {
      name = this.nameTramite;
    }

    this.settings.loadingSpinner = true;
    this.servicio.get('actosentidad/filter/'.concat(code).concat('/').concat(name).concat('/').concat(this.idEntidad)).subscribe(
      result => {
        this.settings.loadingSpinner = false;
        this.mostrarTramites(result);

      }
    )

  }


  filtrar() {
    let depa = '0';
    if (this.filtros[1].value != null) {
      depa = this.filtros[1].value;
    }
    let muni = '0';
    if (this.filtros[2].value != null) {
      muni = this.filtros[2].value;
    }
    let nombre = '0';
    this.settings.loadingSpinner = true;
    this.servicio.get('entidad/filter/'.concat(depa).concat('/').concat(muni).concat('/').concat(nombre)).subscribe(result => {
      this.settings.loadingSpinner = false;
      this.mostrarEntidades(result);

    })

  }




  getDepartamentos() {
    let last_departament: any = null;
    this.ubicaciones.forEach(e => {
      if (last_departament != null) {
        if (e.nombreDepartamentp != last_departament.nombreDepartamentp) {
          last_departament = e;
          this.departamentos.push(e);
        }
      } else {
        last_departament = e;
        this.departamentos.push(e);
      }
    });
  }

  getMunicipiosByDepartamento(departamento: any) {
    this.municipios = new Array();
    let last_municipio: any = null;
    this.ubicaciones.forEach(e => {
      if (e.nombreDepartamentp == departamento.nombreDepartamentp) {
        if (last_municipio != null) {
          if (e.nombreMunicipio != last_municipio.nombreMunicipio) {
            last_municipio = e;
            this.municipios.push(e);
          }
        } else {
          last_municipio = e;
          this.municipios.push(e);
        }

      }
    });
  }






}
