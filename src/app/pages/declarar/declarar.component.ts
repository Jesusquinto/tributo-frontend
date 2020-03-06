import { Component, OnInit, NgZone } from '@angular/core';
import Swal from 'sweetalert2';

import { ApiRestService } from '@servicio';
import { trigger, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RepresentanteService } from '@representados';
import { EndpointsService } from 'src/app/services/endpoints.service';


@Component({
  selector: 'app-tables',
  templateUrl: './declarar.component.html',
  styleUrls: ['./declarar.component.scss'],
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
export class DeclararComponent implements OnInit {
  private url: any;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
      title: 'title2'
    },
    buttonsStyling: false,
  });

  private validadUsuarioAlert: any = {
    title: '¿Está seguro?',
    text: 'Para declarar un tramite debe actualizar sus datos primero ',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Ir a mi perfíl!',
    reverseButtons: true,
  };

  private validarPermisosAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos en este modulo con el representante actual',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };

  private resetTramitesFilter: Subject<void>;
  private resetEntidadesFilter: Subject<void>;

  public idEntidad: any;
  public tributo: any;
  public entidades: any;
  public entidadSeleccionada: any;
  public actos: any;
  public acto: any;
  public estado: string;
  public tramite: any;
  public tributos: any;
  public filterResult: any = 0;

  private representado: any;

  constructor(private servicio: ApiRestService, private ngZone: NgZone, private ruta: Router,
              private _representados: RepresentanteService, private endpoints: EndpointsService) {
    this.url = this.endpoints.endpoints.value;
    this.resetEntidadesFilter = new Subject<void>();
    this.resetTramitesFilter = new Subject<void>();
    this.estado = 'verentidades';
  }


  anularTramiteAlert(tramite: any): any {
    return {
    title: '¿Está seguro?',
    text: 'De Anular este tramite?',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
    };
  }




  showEntidades(entidades: any) {
    this.entidades = entidades;
    if (entidades != null) {
      this.filterResult = Object.keys(this.entidades).length;

    } else {
      this.filterResult = 0;
    }
  }

  showTramites(tramites: any) {
    this.actos = tramites;


    this.filterResult = Object.keys(this.actos).length;
  }



  getEntidades() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    this.servicio.get('entidad/list').subscribe(result => {
      this.entidades = result;
      this.servicio.closeSpinner();
      Toast.fire({
        type: 'success',
        title: 'Entidades',
        text: 'Actualizadas con exito'
      });
    }, error => {
      Toast.fire({
        type: 'error',
        title: error,
        text: error
      });
      this.servicio.closeSpinner();
    });
  }

  verActos(identidad: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    this.servicio.openSpinner();
    this.servicio.get('actosentidad/'.concat(identidad)).subscribe(result => {
      console.log(result);
      this.entidadSeleccionada = result[0].fkBcEntidad;
      console.log(this.entidadSeleccionada);
      this.idEntidad = identidad;
      this.servicio.closeSpinner();
      this.actos = result;
      this.filterResult = Object.keys(this.actos).length;
      if (Object.keys(this.actos).length === 0) {
        Toast.fire({
          type: 'error',
          title: 'error',
          text: 'La entidad no tiene actos por el momento!'
        });
      } else {
        this.estado = 'veractos';
      }
    }, error => {
      this.servicio.closeSpinner();
    });
  }

  verFormulario(acto: any) {
    this.servicio.openSpinner();
    this.servicio.get('actosdetalle/actos/'.concat(acto.fkBcEntidad.idEntidad).concat('/').concat(acto.fkBcActo.idActo)).subscribe(
      result => {
        console.log(result);
        this.servicio.closeSpinner();
        this.tributos = result;
        this.acto = acto;
        this.ResetEntidadesFilter();
        this.estado = 'verformulario';
        console.log(acto);
      }, error => {
        this.servicio.closeSpinner();
        console.log(error);
      });
  }



  verPredial(acto: any) {
    this.estado = 'verpredial';
    this.acto = acto;
  }
  verVehicular(acto: any) {
    this.estado = 'vervehicular';
    this.acto = acto;
  }

  verIca(acto: any) {
    this.estado = 'verica';
    this.acto = acto;
  }

  anularTramite(tramite: any) {
    this.swalWithBootstrapButtons.fire(this.anularTramiteAlert(tramite)).then((result) => {
      if (result.value) {
        this.servicio.openSpinner();
        this.servicio.put('acto/anular/'.concat(tramite.idUsuarioActo), {}).subscribe(
          res => {
            this.servicio.closeSpinner();
            this.estado = 'veractos';
            this.acto = null;
            this.tramite = null;
            this.Toast.fire({
              type: 'success',
              title: 'Exito!',
              text: 'Tramite Anulado'
            });
          }, error => {
            this.Toast.fire({
              type: 'error',
              title: 'Error',
              text: 'Al anular tramite'
            });
          });
      }
    });
  }




  verTramite(tramite: any) {
    console.log(tramite);
    this.servicio.openSpinner();
    this.servicio.get('actosdetalle/actos/'.concat(tramite.fkActoEntidad.fkBcEntidad.idEntidad)
                      .concat('/').concat(tramite.fkActoEntidad.fkBcActo.idActo)).subscribe(
      result => {
        console.log(result);
        this.servicio.closeSpinner();
        this.tributos = result;
        this.acto = tramite.fkActoEntidad;
        this.ResetEntidadesFilter();
        this.tramite = tramite;
        console.log('tramiteeee',this.tramite)
        switch (this.acto.fkBcActo.tipo) {
          case 'ICA':
            this.estado = 'verica';
            break;
          case 'EST':
            this.estado = 'verformulario';
            break;
        }
      }, error => {
        console.log(error);
      });
  }


  validarPermisos() {
    switch (this.representado) {
      case null:
        this.validarusuario();
        break;
      default:
        const permisos: Array<any> = JSON.parse(this.representado.permisos);
        if (!this._representados.permiso(0, 'declarar')) {
          this.swalWithBootstrapButtons.fire(this.validarPermisosAlert).then((res: any) => {
            if (res.value) {
              this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
            } else {
              this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
            }
          });
        }
        break;
    }
  }



  validarusuario() {
    this.servicio.openSpinner();
    this.servicio.getUserData().subscribe(
      (data: any) => {
        this.servicio.closeSpinner();
        switch (data.completeData) {
          case 1:
            break;
          case 0:
            this.swalWithBootstrapButtons.fire(this.validadUsuarioAlert).then((res: any) => {
              if (res.value) {
                this.ngZone.run(() => { this.ruta.navigateByUrl('/user-profile'); });
              } else {
                this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
              }
            });
            break;
        }
      },
      error => {
        this.servicio.closeSpinner();
        console.log(error);
        this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
      });
  }




  ResetTramitesFilter() {
    this.resetTramitesFilter.next();
  }


  ResetEntidadesFilter() {
    this.resetEntidadesFilter.next();
  }


  volver() {
    this.tramite = null;
    this.acto = null;
    switch (this.estado) {
      case 'veractos':
        this.estado = 'verentidades';
        this.ResetEntidadesFilter();
        this.ResetTramitesFilter();
        this.filterResult = 0;
        break;
      case 'verformulario':
        this.estado = 'veractos';
        this.filterResult = Object.keys(this.actos).length;
        break;
      case 'verrangos':
        this.estado = 'verformulario';
        break;
      default:
        this.estado = 'verentidades';
    }
  }

  ngOnInit() {
    /* this.validarusuario(); */
    this._representados.representado.subscribe(value => this.representado = value);
    this.validarPermisos();
  }


}
