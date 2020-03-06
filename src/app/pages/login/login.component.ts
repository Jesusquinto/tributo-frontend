import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '@authService';
import { ApiRestService } from 'src/app/api-rest.service';
import { FormBuilder, FormGroup, Validators, MaxLengthValidator } from '@angular/forms';
import { emailValidator, numberLimits, matchingPasswords, passwordStrength } from 'src/app/components/validators/app-validators';
import { EndpointsService } from 'src/app/services/endpoints.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public url: any;
  public estado: any;
  public Data: FormGroup;
  public DataRegister: FormGroup;
  public estado2: string;
  private token: any;


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
  constructor (
    private ruta: Router,
    private auth: AuthService,
    private servicio: ApiRestService,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private endpoints: EndpointsService  ) {
    this.url = this.endpoints.endpoints.value;
    this.estado = 'iniciar';
    this.estado2 = 'none';
    this.Data = this._formBuilder.group({
      'password': ['' , Validators.compose([Validators.required])],
      'email': [ '' , Validators.compose([Validators.required, emailValidator])]
    });
    this.DataRegister = this._formBuilder.group({
      'password': ['' , Validators.compose([Validators.required])],
      'email': [ '' , Validators.compose([Validators.required, emailValidator])],
      'name' : [ '' , Validators.compose([Validators.required, Validators.maxLength(45)])],
    });

  }

  loginLocal() {
    if (this.Data.valid) {
      this.servicio.openSpinner();
      this.servicio.localLogin({...this.Data.value}).subscribe(
        (token: any) => {
          this.auth.guardarUsuario(token.accessToken);
          this.servicio.post('sessionlog', {
            so : navigator.appVersion.split('(')[1].split(')')[0],
            navegador : this.getBrowserInfo()
          }).subscribe(
            result => {this.servicio.closeSpinner();
              this.ruta.navigateByUrl(this.ruta.createUrlTree(['/dashboard'])); },
            error => {console.log(error), this.servicio.closeSpinner();
            });
        },
        (error: any) => {
          this.servicio.closeSpinner();
          this.Toast.fire({
            type: 'error',
            title: 'Error!',
            text: 'Error al iniciar session'
          });
        });
    } else {
      this.Toast.fire({
        type: 'error',
        title: 'Error!',
        text: 'Revise los campos antes de continuar'
      });
    }
  }


/*   sessionStorage.setItem('so', navigator.appVersion.split('(')[1].split(')')[0]);
  sessionStorage.setItem('browser', this.getBrowserInfo());
 */


getBrowserInfo() {
  var ua= navigator.userAgent, tem, 
  M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
      tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
}




  registrar() {
    if (this.DataRegister.valid) {
      this.servicio.openSpinner();
      this.servicio.localRegister({...this.DataRegister.value}).subscribe(
        (data: any) => {
          this.servicio.closeSpinner();
          this.swalWithBootstrapButtons.fire({
            title: 'Se ha registrado correctamente',
            text: 'Se ha enviado un correo de verificación a ' + data.email + ' para seguir con el registro',
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            reverseButtons: false
          });
        },
       (error: any) => {
         this.servicio.closeSpinner();
          if (error.status === 400) {
            this.Toast.fire({
              type: 'error',
              title: 'Error!',
              text: 'El correo ya está en uso'
            });
          } else {
            this.Toast.fire({
              type: 'error',
              title: 'Error!',
              text: 'Ocurrió un error al registrar'
            });
          }
       });
    } else {
      this.Toast.fire({
        type: 'error',
        title: 'Error!',
        text: 'Revise los campos antes de continuar'
      });
    }
  }



  ngOnInit() {
    this.isRedirect();
  }


  redirectWithToken() {
    this.auth.guardarUsuario(this.token);
    this.ruta.navigateByUrl(
      this.ruta.createUrlTree(
        ['/dashboard']
      ));
  }





  isRedirect() {
      const t: any = this.ruta.url.split('?');
      if (t[1]) {
        const response: any = t[1].split('=');
        switch (response[0]) {
          case 'token':
            this.endpoints.endpoints.subscribe(endpoints => {
              console.log('Fast: ', endpoints);
              this.token = response[1];
              this.auth.guardarUsuario(this.token);
              this.servicio.openSpinner();
              this.servicio.post('sessionlog', {
                so : navigator.appVersion.split('(')[1].split(')')[0],
                navegador : this.getBrowserInfo()
              }).subscribe(
                result => {this.servicio.closeSpinner(); this.redirectWithToken(); },
                error => {console.log(error), this.servicio.closeSpinner();
                });
            });
            break;
          case 'error':
              this.Toast.fire({
                type: 'error',
                title: 'Error!',
                text: decodeURI(response[1])
              });
            break;
          default:
              this.Toast.fire({
                type: 'error',
                title: 'Error!',
                text: response[1]
              });
            break;
        }
      }
    }
 }



