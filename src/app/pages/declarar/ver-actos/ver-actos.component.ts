import { Component, OnInit, Input,Output,EventEmitter, NgZone } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import Swal from 'sweetalert2';
import { ApiRestService } from '../../../api-rest.service';
import { RepresentanteService } from '@representados';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verActos',
  templateUrl: './ver-actos.component.html',
  styleUrls: ['./ver-actos.component.scss'],
})
export class VerActosComponent implements OnInit {

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
      title: 'title2'
    },
    buttonsStyling: false,
  });
  private validarPermisosAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos para crear borradores',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };


  @Input()
  public acto: any;
  @Output() verFormulario = new EventEmitter();
  @Output() verPredial = new EventEmitter();
  @Output() verVehicular = new EventEmitter();
  @Output() verTramite = new EventEmitter();
  @Output() verIca = new EventEmitter();
  @Output() anularTramite = new EventEmitter();


  @Input()
  public actos: Array<any>;
  private representado: any;

  constructor(private servicio: ApiRestService, private ruta: Router,
     private _representados: RepresentanteService, private ngZone: NgZone) {
  }

    AnuTram(tramite: any){
      this.anularTramite.emit(tramite);
    }



    viewTram(tramite: any) {
      this.verTramite.emit(tramite);
    }

    viewForm(acto: any) {
        this.acto = acto;
        this.verFormulario.emit(acto);
    }

    declararActo(acto: any) {


      console.log('ACTO: ', acto.fkBcActo.tipo);

    switch (this.representado) {
      case null:
        this.usuario(acto);
        break;
      default:
      if (!this._representados.permiso(1, {modulo: 'declarar', nombre: 'generarBorrador'})) {
        this.swalWithBootstrapButtons.fire(this.validarPermisosAlert).then((res: any) => {
          if (res.value) {
            this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
          } else {
            this.ngZone.run(() => { this.ruta.navigateByUrl('/dashboard'); });
          }
        });
      } else {
        this.representante(acto, this.representado.cuentaContribuyente);
      }
        break;
    }
  }






   ngOnInit() {
     this._representados.representado.subscribe(value => this.representado = value);
  }


representante(acto: any, usuario: any) {
  switch (acto.fkBcActo.tipo) {
    case 'EST':
        this.declararRepresentante(acto, usuario);
      break;
    case 'IPU':
      this.predial(acto);
      break;
  }

}

usuario(acto: any) {
  switch (acto.fkBcActo.tipo) {
    case 'EST':
        this.declararUsuario(acto);
      break;
    case 'IPU':
      this.predial(acto);
      break;
    case 'VEH':
      this.vehicular(acto);
      break;
    case 'ICA':
      this.ica(acto);
      break;
  }

}




declararRepresentante(acto: any, usuario: any) {
  this.servicio.openSpinner();
    this.servicio.get(`usuariosacto/0/${acto.fkBcEntidad.idEntidad}/${acto.fkBcActo.idActo}/BO/${usuario.idUsuario}`)
    .subscribe((result: any) => {
      this.servicio.closeSpinner();
          let data = new Array();
          data = result;
          if (data.length >= 1) {
            // SEGUIR EDITANDO EL TRAMITE O ANULARLO
            this.swalWithBootstrapButtons.fire({
              title:  'Borrador encontrado',
              text: `Actualmente el representado ${usuario.name} - ${usuario.identificacion}
              tiene un borrador de ${acto.fkBcActo.nombreActo}`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Seguir editandolo!',
              cancelButtonText: 'Anular tramite!',
              reverseButtons: true,
            }).then((opccion) => {
              if (opccion.value) {
                // OPCION SEGUIR EDITANDO EL TRAMITE
                this.viewTram(data[0]);
              } else if (
                opccion.dismiss === Swal.DismissReason.cancel
              ) {
                // OPCION ANULAR TRAMITE
                this.AnuTram(data[0]);
              }
            });
          } else {
            // CREAR TRAMITE NUEVO
            this.swalWithBootstrapButtons.fire({
              title:  '¿Está seguro?',
              text: `¿De declarar un tramite de ${acto.fkBcActo.nombreActo} para el representado
              ${usuario.name} - ${usuario.identificacion}`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si, declarar!',
              cancelButtonText: 'No, cancelar!',
              reverseButtons: true,
            }).then((opcion2: any) => {
              if (opcion2.value) {
                this.viewForm(acto);
              }
            });
          }
    });
}


  predial(acto: any) {
              // CONSULTAR PREDIAL
               this.swalWithBootstrapButtons.fire({
                title:  '¿Está seguro?',
                text: '¿De revisar el impuesto predial unificado (I.P.U)?',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true,
              }).then((opcion: any) => {
                if (opcion.value) {
                  this.verPredial.emit(acto);
                }
              });
  }


  ica(acto: any) {
    // CONSULTAR PREDIAL
    this.servicio.openSpinner();
    this.servicio.get(`usuariosacto/filter/0/${acto.fkBcEntidad.idEntidad}/${acto.fkBcActo.idActo}/BO`).subscribe((result: any) => {
      this.servicio.closeSpinner();
          let data = new Array();
          data = result;
          if (data.length >= 1) {
            // SEGUIR EDITANDO EL TRAMITE O ANULARLO
            this.swalWithBootstrapButtons.fire({
              title:  'Borrador encontrado',
              text: 'Actualmente usted tiene un borrador de '.concat(acto.fkBcActo.nombreActo),
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Seguir editandolo!',
              cancelButtonText: 'Anular tramite!',
              reverseButtons: true,
            }).then((opccion) => {
              if (opccion.value) {
                // OPCION SEGUIR EDITANDO EL TRAMITE
                this.viewTram(data[0]);
              } else if (
                opccion.dismiss === Swal.DismissReason.cancel
              ) {
                // OPCION ANULAR TRAMITE
                this.AnuTram(data[0]);
              }
            });
          } else {
            // CREAR TRAMITE NUEVO
            this.swalWithBootstrapButtons.fire({
              title:  '¿Está seguro?',
              text: '¿De declarar un tramite de industria y comercio?',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: 'Si!',
              cancelButtonText: 'No, cancelar!',
              reverseButtons: true,
            }).then((opcion: any) => {
              if (opcion.value) {
                this.verIca.emit(acto);
              }
            });
          }
    });


}



vehicular(acto: any) {
   // CONSULTAR PREDIAL
   this.swalWithBootstrapButtons.fire({
    title:  '¿Está seguro?',
    text: '¿De revisar el impuesto vehícular?',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true,
  }).then((opcion: any) => {
    if (opcion.value) {
      this.verVehicular.emit(acto);
    }
  });
}




  declararUsuario(acto: any) {
    this.servicio.openSpinner();
    this.servicio.get(`usuariosacto/filter/0/${acto.fkBcEntidad.idEntidad}/${acto.fkBcActo.idActo}/BO`).subscribe((result: any) => {
      this.servicio.closeSpinner();
          let data = new Array();
          data = result;
          if (data.length >= 1) {
            // SEGUIR EDITANDO EL TRAMITE O ANULARLO
            this.swalWithBootstrapButtons.fire({
              title:  'Borrador encontrado',
              text: 'Actualmente usted tiene un borrador de '.concat(acto.fkBcActo.nombreActo),
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Seguir editandolo!',
              cancelButtonText: 'Anular tramite!',
              reverseButtons: true,
            }).then((opccion) => {
              if (opccion.value) {
                // OPCION SEGUIR EDITANDO EL TRAMITE
                this.viewTram(data[0]);
              } else if (
                opccion.dismiss === Swal.DismissReason.cancel
              ) {
                // OPCION ANULAR TRAMITE
                this.AnuTram(data[0]);
              }
            });
          } else {
            // CREAR TRAMITE NUEVO
            this.swalWithBootstrapButtons.fire({
              title:  '¿Está seguro?',
              text: '¿De declarar un tramite de '.concat(acto.fkBcActo.nombreActo).concat('?'),
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si, declarar!',
              cancelButtonText: 'No, cancelar!',
              reverseButtons: true,
            }).then((opcion2: any) => {
              if (opcion2.value) {
                this.viewForm(acto);
              }
            });
          }
    });
  }


}
