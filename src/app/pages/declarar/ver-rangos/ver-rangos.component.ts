import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { AppSettings } from '../../../app.settings';

//MODELS
import { Settings } from '../../../app.settings.model';

import Swal from 'sweetalert2';

import { ApiRestService } from '../../../api-rest.service';

@Component({
  selector: 'app-verRangos',
  templateUrl: './ver-rangos.component.html',
  styleUrls: ['./ver-rangos.component.scss'],
})
export class VerRangosComponent implements OnInit {

    /* @Output() verActos = new EventEmitter();
    viewActos(entidad: any) {
        this.entidad= entidad;
        this.verActos.emit(entidad.idEntidad);
    }  */ 

  @Input()
  public tributo: any;
  @Input()
  public acto: any;
  @Output() verFormulario = new EventEmitter();
  viewForm(acto: any) {
      this.acto= acto;
      this.verFormulario.emit(acto);
  } 

    declararActo(acto:any){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
          title: 'title2'
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons.fire({
        title:  '¿Está seguro?',
        text: '¿De declarar un acto de '.concat(acto.fkBcActo.nombreActo).concat('?'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, declarar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
      
          //QUE VA A HACER
          this.viewForm(acto);



        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'La acción se cancelo!',
            'error'
          )
        }
      })
    }



  public settings: Settings;
  constructor(public appSettings: AppSettings, private servicio: ApiRestService) { 
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;
  }

   ngOnInit() {
     console.log(this.tributo);
  }


}
