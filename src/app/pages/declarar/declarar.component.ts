import { Component, OnInit, NgZone } from '@angular/core';
import { AppSettings } from '../../app.settings';

//MODELS
import { Settings } from '../../app.settings.model';
import { selectDropdownModel } from '../../components/select-dropdown/select-dropdown.model';
import { Entidad } from '../../modelos/entidad.model';

import Swal from 'sweetalert2';

import { ApiRestService } from '../../api-rest.service';
import { trigger, style, transition, animate, keyframes, query, stagger, group, state, animateChild } from '@angular/animations';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Endpoints } from 'src/app/endpoints';


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
  private url : any;

  public departamento: selectDropdownModel = new selectDropdownModel(null, null, null);
  public departamentos: selectDropdownModel[] = [
    new selectDropdownModel('antioquia', 'Antioquia', 'ni ni-pin-3'),
    new selectDropdownModel('nariño', ' Nariño', 'ni ni-pin-3'),
    new selectDropdownModel('bolivar', 'Bolivar', 'ni ni-pin-3'),
  ];

  public municipio: selectDropdownModel = new selectDropdownModel(null, null, null);
  public municipios: selectDropdownModel[] = [
    new selectDropdownModel('barranquilla', 'Barranquilla', 'ni ni-pin-3'),
    new selectDropdownModel('cartagena', 'Cartagena', 'ni ni-pin-3'),
    new selectDropdownModel('magdalena', 'Magdalena', 'ni ni-pin-3'),
  ];

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  public idEntidad: any;
  public tributo: any;

  public entidades: any;
  public entidadSeleccionada: any;

  public actos: any;
  public acto: any;
  public estado: string;

  public tributos: any;

  public filterResult: any = 0;

  public settings: Settings;
  constructor(public appSettings: AppSettings, private servicio: ApiRestService, private ngZone: NgZone, private ruta: Router) {
    this.url = Endpoints;
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = true;
    this.estado = 'verentidades';
  }

  showEntidades(entidades: any) {
    this.entidades = entidades;
    if(entidades != null){
      this.filterResult = Object.keys(this.entidades).length;

    }else{
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
    this.settings.loadingSpinner = true;
    this.servicio.get('entidad/list').subscribe(result => {
      this.entidades = result;
      this.settings.loadingSpinner = false;
      Toast.fire({
        type: 'success',
        title: 'Entidades',
        text: 'Actualizadas con exito'
      })
    }, error => {
      Toast.fire({
        type: 'error',
        title: error,
        text: error
      })
      this.settings.loadingSpinner = false;
    })
  }

  verActos(identidad: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    this.settings.loadingSpinner = true;
    this.servicio.get('actosentidad/'.concat(identidad)).subscribe(result => {
      console.log(result);
      this.entidadSeleccionada = result[0].fkBcEntidad;
      console.log(this.entidadSeleccionada);
      this.idEntidad = identidad;
      this.settings.loadingSpinner = false;
      this.actos = result;
      this.filterResult = Object.keys(this.actos).length;
      if (Object.keys(this.actos).length == 0) {
        Toast.fire({
          type: 'error',
          title: 'error',
          text: 'La entidad no tiene actos por el momento!'
        })
      } else {
        this.estado = 'veractos';
      }
    }, error => {
      this.settings.loadingSpinner = false;
    });
  }

  verFormulario(acto: any) {
    
    this.settings.loadingSpinner = true;
    this.servicio.get('actosdetalle/actos/'.concat(acto.fkBcEntidad.idEntidad).concat('/').concat(acto.fkBcActo.idActo)).subscribe(
      result => {
        console.log(result);
        this.settings.loadingSpinner = false;
        this.tributos = result;
        this.acto = acto;
        this.ResetEntidadesFilter();
        this.estado = 'verformulario';
        console.log(acto);
      }, error => {
        console.log(error);
      }
    )


  }



  validarusuario() {
    this.settings.loadingSpinner = true;
    this.servicio.getUserData().subscribe(
      (result: any) => {
        this.settings.loadingSpinner = false;

        if (result.completeData == 1) {





        } else {

          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-primary',
              title: 'title2'
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons.fire({
            title: '¿Está seguro?',
            text: 'Para declarar un tramite debe actualizar sus datos primero ',
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ir a mi perfíl!',
            reverseButtons: true,
          }).then((result) => {
            if (result.value) {
              this.ngZone.run(() => { this.ruta.navigateByUrl('/user-profile') });
            } else {
              this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard') });

            }
          });
        }
      }
    )
  }

  verRegistro(datos: any) {
    this.tributo = datos;
    this.estado = "verrangos"

  }


  declarar(datos: any) {
    console.log("---------------------------------------------------")
    console.log(datos);
    this.settings.loadingSpinner = true;
    let archivo = datos.pdfRuta;
    console.log(archivo);
    datos.pdfRuta = '';

    this.servicio.post('usuariosacto/save/'.concat(this.acto.fkBcEntidad.idEntidad).concat('/').concat(this.acto.fkBcActo.idActo), datos).subscribe((result: any) => {

      console.log(result.idUsuarioActo);
      

      let formData = new FormData();
	    formData.append('archivo', archivo);
	    formData.append('id', result.idUsuarioActo);
      this.servicio.setUsuarioActo(formData).subscribe(result =>{
        this.Toast.fire({
          type: 'success',
          title: 'Genial!',
          text: 'Se ha creado el acto '.concat(datos.descripcion).concat(' con exito!')
        })
         
    
          this.estado = 'verentidades'
     

     
    },error=>{
      this.Toast.fire({
        type: 'error',
        title: 'Error',
        text: error.error
      })

    })
    
    

    
  }, error => {
      console.log(error);
      this.settings.loadingSpinner = false;
      this.Toast.fire({
        type: 'error',
        title: 'Error',
        text: error.error
      })

    })


  }

  private resetTramitesFilter: Subject<void> = new Subject<void>();

  ResetTramitesFilter() {
    this.resetTramitesFilter.next()
  }



  private resetEntidadesFilter: Subject<void> = new Subject<void>();

  ResetEntidadesFilter() {
    this.resetEntidadesFilter.next()
  }


  volver() {
    switch (this.estado) {
      case 'veractos':
        this.estado = 'verentidades';
        this.ResetEntidadesFilter();
        this.ResetTramitesFilter();
        this.filterResult = 0;
        break;
      case 'verformulario':
        this.estado = 'veractos'
        this.filterResult = Object.keys(this.actos).length
        break;
      case 'verrangos':
        this.estado = 'verformulario';
        break;
      default:
        this.estado = 'verentidades';

    }

  }

  ngOnInit() {
    this.validarusuario();

  }


}
