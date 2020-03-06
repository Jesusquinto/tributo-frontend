import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router' 
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import Swal from 'sweetalert2';
import { AuthService } from '@authService';
import { ApiRestService } from 'src/app/api-rest.service';
import { FormBuilder, FormGroup, Validators, MaxLengthValidator } from '@angular/forms';
import { emailValidator, numberLimits, matchingPasswords, passwordStrength } from 'src/app/components/validators/app-validators';
import { EndpointsService } from 'src/app/services/endpoints.service';


@Component({
  selector: 'app-confirmarInvitacion',
  templateUrl: './confirmar-invitacion.component.html',
  styleUrls: ['./confirmar-invitacion.component.scss']
})
export class ConfirmarInvitacionComponent implements OnInit, OnDestroy {
  public url: any;
  public settings: Settings;
  public key: any;

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
  constructor(private ruta: Router, public appSettings: AppSettings, private auth: AuthService,
              private servicio: ApiRestService, private activatedRoute: ActivatedRoute,  
              private _formBuilder: FormBuilder, private endpoints: EndpointsService ) {
    this.settings = this.appSettings.settings;
    this.url = this.endpoints.endpoints.value;
  }


  ngOnInit() {
    this.settings.loadingSpinner = true;
    this.activatedRoute.paramMap.subscribe(params => {
      this.key = params.get('clave');
      this.servicio.confirmarInvitacion(this.key).subscribe(
        (result: any) => {
          this.settings.loadingSpinner = false;
          this.swalWithBootstrapButtons.fire(
            'Perfecto!',
            result.mensaje,
            'success'
          ).then(result => {
            this.ruta.navigate(['login']);
          });
        },
        (error: any) => {
          console.log(error);
          this.settings.loadingSpinner = false;
          this.swalWithBootstrapButtons.fire(
            'Ocurrió un error',
            error.error.mensaje,
            'error'
          ).then( result =>{
            this.ruta.navigate(['login']);
          });
        }
      );
    });


  }


  ngOnDestroy() {
  }



}
