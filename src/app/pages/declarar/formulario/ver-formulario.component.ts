import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppSettings } from '../../../app.settings';

//MODELS
import { Settings } from '../../../app.settings.model';
//FORMN IMPORTS
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { numberLimits, emailValidator, matchingPasswords, passwordStrength, itsPdf } from '../../../components/validators/app-validators';
import Swal from 'sweetalert2';
import { selectDropdownModel } from '../../../components/select-dropdown/select-dropdown.model'
import { ApiRestService } from '../../../api-rest.service';
import { Parametros } from '../../../modelos/ge_parametros.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-verFormulario',
  templateUrl: './ver-formulario.component.html',
  styleUrls: ['./ver-formulario.component.scss'],
})
export class VerFormularioComponent implements OnInit {

  /* @Output() verActos = new EventEmitter();
  viewActos(entidad: any) {
      this.entidad= entidad;
      this.verActos.emit(entidad.idEntidad);
  }  */
  public datos: FormGroup;

  public valorapagar: number = 0;
  public contratoSeleccionado: File;

  public file: any;

  public usuario: any;
  @Input()
  public acto: any;
  @Input()
  public tributos: any;
  public pdfSrc: any;





  public identificacion: any;
  @Output() enviarFormulario = new EventEmitter();
  @Output() verRegistro = new EventEmitter();



  public periodo = new selectDropdownModel('', 'Seleccionar periodo', 'ni ni-calendar-grid-58');
  public periodos: selectDropdownModel[] = [
    new selectDropdownModel('2019', ' Anual, 2019', 'ni ni-calendar-grid-58'),
    new selectDropdownModel('2018', ' Anual, 2018', 'ni ni-calendar-grid-58')
  ];
  public contratante: any;
  public contratantes: selectDropdownModel[] = [];
  ;

  verRegistros(tributo: any) {
    this.verRegistro.emit(tributo);
  }


  setContratante(contratante: any) {
    this.contratante = contratante;
    this.datos.controls['contratante'].setValue(this.contratante.idEntidadContratantes);
  }


  setPeriodo(periodo: any) {
    this.periodo = periodo;
    this.datos.controls['periodo'].setValue(this.periodo.value);

  }




  public settings: Settings;
  constructor(public appSettings: AppSettings, private servicio: ApiRestService, private _formBuilder: FormBuilder, private cd: ChangeDetectorRef) {

    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;
  }
  public fieldValidation(datos: FormGroup, name: any) {
    if (datos.get([name])) {
      if (datos.get([name]).invalid && datos.get([name]).touched) {

        return true;
      }

    }

  }



  onFileChange(event) {


      this.contratoSeleccionado = event.target.files[0];
      console.log('sjdhidj');
      this.datos.controls['file'].markAsTouched();
      this.datos.controls['file'].setValue(event.target.files[0]);
      console.log(this.datos.controls['file'].value.type);
      if(this.datos.controls['file'].value.type == 'application/pdf'){
        let $img: any = document.querySelector('#file');
        if (typeof (FileReader) !== 'undefined') {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;
          };
          reader.readAsArrayBuffer($img.files[0]);
        }
      }else{
        this.pdfSrc = 1;
      }
  }




  declarar(event: FormGroup) {

    console.log(event);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        title: 'title2'
      },
      buttonsStyling: false,
    });
    if (event.valid) {
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro de declarar este acto?',
        text: "Podras eliminarlo despues, pero quedara en la papelera!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, declarar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          this.enviar();
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'La acción se cancelo!',
            'error'
          )
        }
      })
    } else {
      this.markFormGroupTouched(event);
      swalWithBootstrapButtons.fire(
        'Datos incorrectos',
        'Revise el formulario y vuelva a intentarlo!',
        'error'
      );
    }
    return false;
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }






  enviar() {
    /* let usuacto = new FormData();
    usuacto.append('estado', 'BO');
    usuacto.append('valorApagar',this.valorapagar.toString());
    usuacto.append('tipoPeriodo', this.datos.controls['periodo'].value);
    usuacto.append('numeroActo', this.datos.controls['numerocontrato'].value);
    usuacto.append('archivo', this.contratoSeleccionado);
    usuacto.append('datosEsquema', '');
    usuacto.append('descripcion', this.datos.controls['nombrecontrato'].value);
    usuacto.append('fkActoEntidad', this.acto.idActoEntidad);
    usuacto.append('fkEntidadContratantes', parseInt(this.datos.controls['contratante'].value).toString());
    usuacto.append('fkUsuario', this.usuario.id_usuario);
    usuacto.append('fechaInicioActo', this.datos.controls['fechainiciocontrato'].value); */


    let usuacto = {
      estado: 'BO',
      valorApagar: this.valorapagar,
      tipoPeriodo: this.datos.controls['periodo'].value,
      numeroActo: this.datos.controls['numerocontrato'].value,
      valorActo: this.datos.controls['valorcontrato'].value,
      pdfRuta: this.contratoSeleccionado,
      datosEsquema: '',
      descripcion: this.datos.controls['nombrecontrato'].value,
      fkActoEntidad: this.acto.idActoEntidad,

      fkEntidadContratantes: parseInt(this.datos.controls['contratante'].value),
      fkUsuario: this.usuario.id_usuario,
      fechaInicioActo: this.datos.controls['fechainiciocontrato'].value
    }
    this.enviarFormulario.emit(usuacto);
  }









  public suma: number;

  calcular() {
    if (this.datos.controls['valorcontrato'].valid) {
      this.settings.loadingSpinner = true;

      this.servicio.get('usuariosacto/calcular/'.concat(this.acto.fkBcEntidad.idEntidad).concat('/'.concat(this.acto.fkBcActo.idActo).concat('/')
        .concat(this.datos.controls['valorcontrato'].value))).subscribe((result: any) => {
          this.settings.loadingSpinner = false;
          this.valorapagar = parseInt(result.toString());
          console.log(result);
        })

    }
  }





  ngOnInit() {

    $("form").on("change", ".file-upload-field", function () {
      $(this).parent(".file-upload-wrapper").attr("data-text", $(this).val().replace(/.*(\/|\\)/, ''));
    });


    this.settings.loadingSpinner = true;

    this.servicio.getUserData().subscribe(result => {
      this.usuario = result;
      this.identificacion = this.usuario.identificacion;

      this.servicio.get('entidadcontratantes/'.concat(this.acto.fkBcEntidad.idEntidad)).subscribe(
        (result: any) => {
          this.contratantes = result;
          this.suma = 0;
          this.tributos.forEach(tributo => {
            let valor = parseFloat(tributo.fkEntidadTributo.parametroTributo);
            this.suma += valor;


          });
          this.settings.loadingSpinner = false;


        }
      );


    });


    this.datos = this._formBuilder.group({
      'contratante': ['', Validators.compose([Validators.required])],
      'nombrecontrato': ['', Validators.compose([Validators.required])],
      'valorcontrato': [, Validators.compose([Validators.required,])],
      'periodo': ['', Validators.compose([Validators.required])],
      'numerocontrato': [ , Validators.compose([Validators.required])],
      'fechainiciocontrato': [, Validators.compose([Validators.required ])],
      'file': [, Validators.compose([Validators.required, itsPdf()])],
      'contratanteSearch': ['']

    });



    console.log(this.tributos);
    this.tributos.forEach(t => {
      try {
        t.fkEntidadTributo.parametroTributo = JSON.parse(t.fkEntidadTributo.parametroTributo);
        t.rangosCount = (t.fkEntidadTributo.parametroTributo).length;
      } catch (error) {
      }

    });


  }


}
