import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { numberLimits, itsPdf } from '../../../components/validators/app-validators';
import Swal from 'sweetalert2';
import { ApiRestService } from '../../../api-rest.service';
import * as $ from 'jquery';
import {MatDialog, } from '@angular/material/dialog';
import { LlaveModal } from 'src/app/components/llaveModal/llaveModal.component';
import { Router } from '@angular/router';
import { AuthService } from '@authService';
import { RepresentanteService } from '@representados';
import { trigger, style, transition, animate } from '@angular/animations';
import * as FileSaver from 'file-saver';
import { EndpointsService } from 'src/app/services/endpoints.service';


@Component({
  selector: 'app-ver-estampillas',
  templateUrl: './ver-estampillas.component.html',
  styleUrls: ['./ver-estampillas.component.scss'],
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
export class VerEstampillasComponent implements OnInit {


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

  private validarPermisosAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos para crear borradores',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };


  private validarPermisosFirmarAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos para firmar tramites',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };





  @Input() public acto: any;
  @Input() public tributos: any;
  @Input() public tramite: any;

  @Output() Anular = new EventEmitter();




  public datos: FormGroup;
  public valorapagar: number;
  public contratoSeleccionado: File;
  public file: any;
  public suma: number;
  public usuario: any;
  public pdfSrc: any;
  public periodos: any;
  public tipoContratos: any;
  public pdf: any;
  public estado: any;
  private url: any;
  public identificacion: any;
  public contratante: any;
  public contratantes: any;
  public vigencias: any;

  public representado: any;


  private guardarBorradorAlert: any = {
    title: '¿Estás seguro de guardar este borrador?',
    text: 'Podras seguir editandolo si quieres!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, guardar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true,
  };

  private generarFirmaAlert: any = {
    title: '¿Estás seguro de generar una llave del tramite actual?',
    text: 'Se enviará a su correo ' + this.auth.obtenerDatosToken(sessionStorage.getItem('token')).email + '!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true,
};


  constructor(public appSettings: AppSettings, private servicio: ApiRestService,
              private _formBuilder: FormBuilder, private auth: AuthService,
               public dialog: MatDialog, public router: Router, private _representados: RepresentanteService,
               private endpoints: EndpointsService) {
    this.url = endpoints.endpoints.value;
    this.estado = 'verTramite';
    this.valorapagar = 0;
    this.datos = this._formBuilder.group({
      'fkEntidadContratantes': ['', Validators.compose([Validators.required])],
      'descripcion': ['', Validators.compose([Validators.required])],
      'ContratanteFilterCtrl' :  [''],
      'tipoVigencia': ['', Validators.compose([Validators.required])],
      'valorActo': [0, Validators.compose([Validators.required, numberLimits({max: 25, min: 4})])],
      'tipoPeriodo': ['', Validators.compose([Validators.required])],
      'numeroActo': [ , Validators.compose([Validators.required])],
      'fechaInicioActo': [, Validators.compose([Validators.required ])],
      'file': [, Validators.compose([Validators.required, itsPdf()])],
      'fechaVencimientoActo': [, Validators.compose([Validators.required ])],
      'retencion': ['1', Validators.compose([Validators.required ])]
    });
  }


  ngOnInit() {

    this._representados.representado.subscribe( value => this.representado = value);


    $('form').on('change', '.file-upload-field', function () {
      $(this).parent('.file-upload-wrapper').attr('data-text', $(this).val().replace(/.*(\/|\\)/, ''));
    });

    this.getParametrosEstampillas();

    console.log('tributos', this.tributos);
    this.tributos.forEach(t => {
      try {
        t.fkEntidadTributo.parametroTributo = JSON.parse(t.fkEntidadTributo.parametroTributo);
        t.rangosCount = (t.fkEntidadTributo.parametroTributo).length;
        console.log(t);
        } catch (error) {
      }
    });
  }







  openDialog(estado: any, fecha: Date, usuario: any): void {
    const dialogRef = this.dialog.open(LlaveModal, {
      width: '450px',
      disableClose : true ,
      data: { 'tramite' : this.tramite , 'usuario' : usuario, 'estado': estado, 'fechaExpiracion': fecha}
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result.estado === 0) {
          this.tramite.estado = 'PR';
        }
    });
  }




  onFileChange(event: any) {
      this.contratoSeleccionado = event.target.files[0];
      this.datos.controls['file'].markAsTouched();
      this.datos.controls['file'].setValue(event.target.files[0]);
      if (this.datos.controls['file'].value.type === 'application/pdf') {
        const $img: any = document.querySelector('#file');
        if (typeof (FileReader) !== 'undefined') {
          const  reader = new FileReader();
          reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;
          };
          reader.readAsArrayBuffer($img.files[0]);
        }
      } else {
        this.pdfSrc = 1;
      }
  }

  guardar() {
    if (this.tramite) {
      this.datos.removeControl('file');
    }

    if (this.datos.valid) {
    switch (this.representado) {
      case null:
        this.swalWithBootstrapButtons.fire(this.guardarBorradorAlert).then(
          (result) => {
          if (result.value) {
            this.enviarFormularioEstUsuario();
          }
        });
        break;
      default:
      if (!this._representados.permiso(1, {modulo: 'declarar', nombre: 'generarBorrador'})) {
        this.swalWithBootstrapButtons.fire(this.validarPermisosAlert).then((res: any) => {});
      } else {
        this.swalWithBootstrapButtons.fire(this.guardarBorradorAlert).then(
          (result) => {
          if (result.value) {
            this.enviarFomularioEstRepresentados();
          }
        });
      }
        break;
    }
    } else {
      Object.keys(this.datos.controls).forEach(controlName => this.datos.controls[controlName].markAsTouched());
      this.swalWithBootstrapButtons.fire(
        'Datos incorrectos',
        'Revise el formulario y vuelva a intentarlo!',
        'error'
      );
    }
  }



  generarLlave() {
    this.estado = 'verTramite';

    switch (this.representado) {
      case null:
         this.pedirFirma();
        break;
      default:
        if (!this._representados.permiso(1, {modulo: 'declarar', nombre: 'presentar'})) {
          this.swalWithBootstrapButtons.fire(this.validarPermisosFirmarAlert).then((res: any) => {});
        } else {
          this.pedirFirma();
        }

        break;
    }


  }


  pedirFirma() {
    this.swalWithBootstrapButtons.fire(this.generarFirmaAlert).then((res) => {
      if (res.value) {
          this.servicio.openSpinner();
          this.servicio.post('generarllave/'.concat(this.tramite.idUsuarioActo), {}).subscribe(
            (result: any) => {
              this.servicio.closeSpinner();
              if (result.estado === 0) {
                this.Toast.fire({
                  type: 'success',
                  title: 'Genial!',
                  text: 'Se ha generado la llave del tramite '.concat(result.consecutivoActo).concat(' con exito!')
                });
              }
              this.openDialog(result.estado, result.fechaExpiracion, this.auth.obtenerDatosToken(sessionStorage.getItem('token')));
              console.log(result);
            },
            error => {
              this.servicio.closeSpinner();
              this.Toast.fire({
                type: 'error',
                title: 'Error!',
                text: 'Hubo un error al generar la llave'
                });
            });
        }
      });
  }




  generarPDF() {
    this.servicio.openSpinner();
    this.servicio.get(`reporte/estampillas/${this.tramite.idUsuarioActo}`).subscribe(
      (path: any) => {
        this.pdf = `${this.url.complete}tramite/ver/${path.ruta}`;
        this.estado = 'verPDF';
      },
      error => {this.servicio.closeSpinner(); console.log( error); }
    );
  }

  pdfCargado(e) {
    this.servicio.closeSpinner();
  }

  pdfError(e: any) {
    console.log(e);
    this.servicio.closeSpinner();
  }

  public savePDF() {
    FileSaver.saveAs(this.pdf, 'TRAMITE');
  }


  enviarFomularioEstRepresentados() {
    const datos = {...this.datos.value};
    datos.pdfRuta = null;
    switch (this.tramite !== undefined) {
      case true:
        // TRAMITE EXITS = SAVE TRAMITE
        datos.idUsuarioActo = this.tramite.idUsuarioActo;
        datos.pdfRuta = this.tramite.pdfRuta;
        this.servicio.openSpinner();
          this.servicio.put(`usuariosacto/representado/${this.tramite.idUsuarioActo}/
          ${this.acto.fkBcEntidad.idEntidad}/${this.acto.fkBcActo.idActo}/${this.representado.cuentaContribuyente.idUsuario}`,
           datos).subscribe((result: any) => {
           if (this.tramite) {
               this.servicio.closeSpinner();
                this.Toast.fire({
                  type: 'success',
                  title: 'Genial!',
                  text: 'Se ha guardado el acto de '.concat(result.descripcion).concat(' con exito!')
                });
               this.tramite = result;
           }
      }, error => {
            this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'error',
              title: 'Error',
              text: error.error.mensaje
            });
          });
        break;

      case false:
        datos.pdfRuta = this.contratoSeleccionado;
        datos.fkActoEntidad = this.acto.idActoEntidad;
        const archivo = datos.pdfRuta;
          // TRAMITE NOT EXITS = CREATE TRAMITE
          // SE CREA EL FORMDATA
          const formData = new FormData();
          formData.append('archivo', archivo);
          formData.append('idEntidad', this.acto.fkBcEntidad.idEntidad);
          formData.append('idActo', this.acto.fkBcActo.idActo);
          formData.append('tramite', JSON.stringify(datos));
        this.servicio.openSpinner();
        this.servicio.newActoRepresentado(formData, this.representado.cuentaContribuyente.idUsuario).subscribe(
          (tramite: any) => {this.servicio.closeSpinner(); this.tramite = tramite;
                      this.Toast.fire({
                        type: 'success',
                        title: 'Genial!',
                        text: 'Se ha creado el acto de '.concat(tramite.descripcion).concat(' con exito!')
                    });
                  },
          error => {this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'error',
              title: 'Error',
              text: error.error.mensaje
            });
          });
        break;
    }
  }




  enviarFormularioEstUsuario() {
    const datos = {...this.datos.value};
    datos.pdfRuta = null;
    switch (this.tramite !== undefined && this.tramite !== null) {
      case true:
        // TRAMITE EXITS = SAVE TRAMITE
        datos.idUsuarioActo = this.tramite.idUsuarioActo;
        datos.pdfRuta = this.tramite.pdfRuta;
        this.servicio.openSpinner();
          this.servicio.put(`usuariosacto/${this.tramite.idUsuarioActo}/${this.acto.fkBcEntidad.idEntidad}/${this.acto.fkBcActo.idActo}`,
           datos).subscribe((result: any) => {
           if (this.tramite) {
               this.servicio.closeSpinner();
                this.Toast.fire({
                  type: 'success',
                  title: 'Genial!',
                  text: 'Se ha guardado el acto de '.concat(result.descripcion).concat(' con exito!')
                });
               this.tramite = result;
           }
      }, error => {
            this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'error',
              title: 'Error',
              text: error.error.mensaje
            });
          });
        break;

      case false:
        datos.pdfRuta = this.contratoSeleccionado;
        datos.fkActoEntidad = this.acto.idActoEntidad;
        const archivo = datos.pdfRuta;
          // TRAMITE NOT EXITS = CREATE TRAMITE
          // SE CREA EL FORMDATA
          const formData = new FormData();
          formData.append('archivo', archivo);
          formData.append('idEntidad', this.acto.fkBcEntidad.idEntidad);
          formData.append('idActo', this.acto.fkBcActo.idActo);
          formData.append('tramite', JSON.stringify(datos));
        this.servicio.openSpinner();
        this.servicio.newActo(formData).subscribe(
          (tramite: any) => {this.servicio.closeSpinner(); this.tramite = tramite;
                      this.Toast.fire({
                        type: 'success',
                        title: 'Genial!',
                        text: 'Se ha creado el acto de '.concat(tramite.descripcion).concat(' con exito!')
                    });
                  },
          error => {this.servicio.closeSpinner();
            this.Toast.fire({
              type: 'error',
              title: 'Error',
              text: error.error.mensaje
            });
          });
        break;
    }
  }




cerrar() {
  this.estado = 'verFormulario';
}


  calcular() {
    if (this.datos.controls['valorActo'].valid) {
      console.log('valor', this.datos.controls['valorActo'].value)
      this.servicio.openSpinner();
      this.servicio.get(`usuariosacto/calcular/${this.acto.fkBcEntidad.idEntidad}/${this.acto.fkBcActo.idActo}/
      ${this.datos.controls['valorActo'].value}`).subscribe(
        (result: any) => {
          this.servicio.closeSpinner();
          this.valorapagar = parseInt(result.toString());
          console.log(result);
        },
        error => {
          this.servicio.closeSpinner();
          this.Toast.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ocurrio un errror al calcular el valor'
        });
        });
    } else {
      this.Toast.fire({
        type: 'error',
        title: 'Error!',
        text: 'Debe rellenar el valor el contrato'
    });

    }
  }


anular() {
   this.Anular.emit(this.tramite);
}









getEntidadesContratantes() {
  this.servicio.openSpinner();
  this.servicio.get(`entidadcontratantes/${this.acto.fkBcEntidad.idEntidad}`).subscribe(
    contratantes => {this.contratantes = contratantes; this.getPeriodos(); console.log(this.contratantes)},
    error => {this.servicio.closeSpinner(); console.log(error); }
  );
}

getPeriodos() {
  this.servicio.get(`parametros/${this.acto.fkBcEntidad.idEntidad}/3`).subscribe(
    periodos => {this.periodos = periodos; this.getVigencias(); },
    error => {this.servicio.closeSpinner(); console.log(error); }
  );
}


getVigencias() {
  this.servicio.get(`parametros/${this.acto.fkBcEntidad.idEntidad}/5`).subscribe(
    vigencias => {this.vigencias = vigencias; this.getTiposContratos()},
    error => {this.servicio.closeSpinner(); console.log(error); }
  );
}

getTiposContratos() {
  this.servicio.get(`parametros/${this.acto.fkBcEntidad.idEntidad}/4`).subscribe(
    tipoContratos => { console.log(this.tramite);
      this.tipoContratos = tipoContratos; this.tramite ? this.datos.patchValue(
        {...this.tramite,
        fechaInicioActo : new Date(this.tramite.fechaInicioActo),
        fechaVencimientoActo : new Date(this.tramite.fechaVencimientoActo),
        fkEntidadContratantes: this.tramite.fkEntidadContratantes.idEntidadContratantes }) : null;
        this.servicio.closeSpinner(); },
    error => {this.servicio.closeSpinner(); console.log(error); }
  );
}


  getParametrosEstampillas() {
    const usuario = this.auth.obtenerDatosToken(sessionStorage.getItem('token'));
    this.identificacion = usuario.identificacion;
    this.getEntidadesContratantes();
      this.suma = 0;
      this.tributos.forEach(tributo => {
      this.suma += parseFloat(tributo.fkEntidadTributo.parametroTributo);
      });
  }




}
