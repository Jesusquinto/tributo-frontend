import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../app.settings';


//MODELS
import { Settings } from '../../app.settings.model';
import { selectDropdownModel } from '../../components/select-dropdown/select-dropdown.model'

//FORMN IMPORTS
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { numberLimits, emailValidator, matchingPasswords, passwordStrength } from '../../components/validators/app-validators';
import Swal from 'sweetalert2'
import { ApiRestService } from '../../api-rest.service';
import { DataService } from 'src/app/data.service';
import { Municipio } from 'src/app/modelos/municipio.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public datos: FormGroup;
  public backdata: any;


  public datoschanged: boolean = true;

  public showMessage: boolean = true;
  public showit: boolean = false;

  public userId: selectDropdownModel = new selectDropdownModel('', '', '');
  public idSelected: selectDropdownModel;
  public idTypes: selectDropdownModel[] = [
    new selectDropdownModel('CC', 'Cedula de ciudadania', 'ni ni-badge'),
    new selectDropdownModel('NIT', ' Número de identificación tributaria', 'ni ni-credit-card'),
    new selectDropdownModel('PE', 'Pasaporte extranjero', 'ni ni-single-copy-04'),
  ];

  public userSexo: selectDropdownModel = new selectDropdownModel('', '', '');
  public sexoSelected: selectDropdownModel;
  public sexoTypes: selectDropdownModel[] = [
    new selectDropdownModel('M', 'Mujer', 'ni ni-single-02'),
    new selectDropdownModel('H', 'Hombre', 'ni ni-single-02'),
  ];


  public userType: selectDropdownModel = new selectDropdownModel('', '', '');
  public typeSelected: selectDropdownModel;
  public typeTypes: selectDropdownModel[] = [
    new selectDropdownModel('PN', 'Persona natural', 'ni ni-circle-08'),
    new selectDropdownModel('PJ', ' Persona Juridíca', 'ni ni-briefcase-24'),
    // new selectDropdownModel('GC', 'Gran Contribuyente', 'ni ni-building'),
  ];


  public userMunicipio: selectDropdownModel = new selectDropdownModel('', '', '');
  public municipioSelected: selectDropdownModel;
  public municipioTypes: selectDropdownModel[] = [
    new selectDropdownModel('1', 'Barranquilla', 'ni ni-world'),
    new selectDropdownModel('2', ' Manizales', 'ni ni-world'),
  ];

  public userContribuyente: selectDropdownModel = new selectDropdownModel('', '', '');
  public contribuyenteSelected: selectDropdownModel;
  public contribuyenteTypes: selectDropdownModel[] = [
    new selectDropdownModel('GC', 'Gran contribuyente', 'ni ni-building'),
    // new selectDropdownModel('2', ' Manizales', 'ni ni-building'),
  ];

  public settings: Settings;

  constructor(private appSettings: AppSettings, private _formBuilder: FormBuilder, private servicio: ApiRestService, private data: DataService) {
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;

  }



  ngOnInit() {

    this.settings.loadingSpinner = true;
    this.servicio.getUserData().subscribe(result => {
      this.backdata = result;

      this.idTypes.forEach(tipos => {
        if (this.backdata.tipoIdentificacion == tipos.value) {
          this.userId = tipos;
        }
      });

      this.sexoTypes.forEach(sexo => {
        if (this.backdata.sexo == sexo.value) {
          this.userSexo = sexo;
        }
      });

      this.typeTypes.forEach(tipopersona => {
        if (this.backdata.tipousuario == tipopersona.value) {
          this.userType = tipopersona;
        }
      });

      this.municipioTypes.forEach(Municipio => {
        if (this.backdata.fkMunicipio == Municipio.value) {
          this.userMunicipio = Municipio;
        }
      });

      this.contribuyenteTypes.forEach(contribuyente => {
        if (this.backdata.tipocontribuyente == contribuyente.value) {
          this.userContribuyente = contribuyente;
        }
      });
      console.log(this.backdata)
      this.datos = this._formBuilder.group({
        'usuario': [this.backdata.usuario, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
        'email': [this.backdata.email, Validators.compose([Validators.required, emailValidator])],
        'name': [this.backdata.name, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(65)])],
        'tipoid': [this.backdata.tipoIdentificacion, Validators.compose([Validators.required])],
        'identificacion': [this.backdata.identificacion, Validators.compose([Validators.required, numberLimits({ max: 11, min: 8 })])],
        'sexo': [this.backdata.sexo, Validators.compose([Validators.required])],
        'direccion': [this.backdata.direccion, Validators.compose([Validators.required])],
        'telefono': [this.backdata.telefono, Validators.compose([Validators.required, numberLimits({ max: 15, min: 6 })])],
        'celular': [this.backdata.celular, Validators.compose([Validators.required, numberLimits({ max: 10, min: 9 })])],
        'tipousuario': [this.backdata.tipousuario, Validators.compose([Validators.required])],
        'fkMunicipio': [this.backdata.fkMunicipio, Validators.compose([Validators.required])],
        'razonsocial': [this.backdata.razonsocial, Validators.compose([Validators.required])],
        'tipocontribuyente': [this.backdata.tipocontribuyente, Validators.compose([Validators.required])],
        
      });
      this.showit = true;
      this.settings.loadingSpinner = false;
      this.datos.valueChanges.subscribe(() => {
        this.datoschanged = true;
        let times: number = 0;
        let veces: number = 0;
        (<any>Object).values(this.datos.controls).forEach(control => {
          (<any>Object).values(this.backdata).forEach(data => {
            if (veces == times) {
              if (control.value != data) {
                this.datoschanged = false;
              }
            }
            veces++;
          });
          veces = 0;
          times++;
        });
      });
    })
    this.ShowMessage();

  }






  hideMessage() {
    this.data.setUserProfileAlert();
    this.ShowMessage();
  }

  ShowMessage() {
    let flag: boolean = this.data.geUserProfileAlert();
    if (flag) {
      this.showMessage = false;
    } else {
      this.showMessage = true;
    }
  }


  setTipoid(idtype: any) {
    this.userId = idtype;
    this.datos.controls['tipoid'].setValue(idtype.value);
    console.log(this.userId)

  }
  setSexo(sexoType: any) {
    this.userSexo = sexoType;
    this.datos.controls['sexo'].setValue(sexoType.value);
    console.log(this.userSexo)
  }

  setTipo(Type: any) {
    this.userType = Type;
    this.datos.controls['tipousuario'].setValue(Type.value);
    console.log(this.userType)
  }

  setMunicipio(municipio: any) {
    this.userMunicipio = municipio;
    this.datos.controls['fkMunicipio'].setValue(municipio.value);
    console.log(this.userMunicipio)
  }

  setContribuyente(contribuyente: any) {
    this.userContribuyente = contribuyente;
    this.datos.controls['tipocontribuyente'].setValue(contribuyente.value);
    console.log(this.userContribuyente)
  }


  actualizar(event: FormGroup) {

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
        title: '¿Estás seguro de Actualizar estos datos?',
        text: "No podrás revertir esta acción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, actualizar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          let body = {
            "tipoIdentificacion": this.userId.value,
            "identificacion": this.datos.controls['identificacion'].value,
            "name": this.datos.controls['name'].value,
            "razonsocial": this.datos.controls['razonsocial'].value,
            "sexo": this.datos.controls['sexo'].value,
            "direccion": this.datos.controls['direccion'].value,
            "telefono": this.datos.controls['telefono'].value,
            "celular": this.datos.controls['celular'].value,
            "email": this.datos.controls['email'].value,
            "usuario": this.datos.controls['usuario'].value,
            "password": this.backdata.password,
            "tipousuario": this.userType.value,
            "fkMunicipio": this.userMunicipio.value,
            "tipocontribuyente": this.userContribuyente.value,
            "imageUrl": this.backdata.imageUrl,
            "provider": this.backdata.provider,
            "providerId": this.backdata.providerId,
            "emailVerified": this.backdata.emailVerified,
            "verifiedAccount": this.backdata.verifiedAccount,
            "completeData": 1
          }
          this.settings.loadingSpinner = true;
          this.servicio.put('frusuarios/update', body).subscribe(
            result => {
              this.settings.loadingSpinner = false;
              swalWithBootstrapButtons.fire(
                'Actualizados!',
                'Tus datos han sido actualizados correctamente.',
                'success'
              )

            },
            error => {
              this.settings.loadingSpinner = false;
              console.log(error);
              swalWithBootstrapButtons.fire(
                'Error',
                'Hubo un problema al actualizar los datos!',
                'error'
              )
            }
          );





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


  public fieldValidation(datos: FormGroup, name: any) {
    if (datos.get([name]).invalid && datos.get([name]).touched) {

      return true;
    }
  }



}
