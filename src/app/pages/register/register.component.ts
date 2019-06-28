import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { numberLimits, emailValidator, matchingPasswords, passwordStrength } from '../../components/validators/app-validators';
import { trigger, style, transition, animate, keyframes, query, stagger, group, state, animateChild } from '@angular/animations';
import { Router } from '@angular/router' 

import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import * as $ from 'jquery';
declare var device;
declare var window;
import Swal from 'sweetalert2';
import { DataService } from '../../data.service';
import { ApiRestService } from '../../api-rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
})



export class RegisterComponent implements OnInit {
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  public settings: Settings;
  constructor(private _formBuilder: FormBuilder,private ruta : Router,  private ngZone: NgZone,public appSettings: AppSettings,private data: DataService,private servicio: ApiRestService  ) {
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = true;
  }

  datos: FormGroup;
  @Input()
  fuerzaDeContrasena: string;

  ngOnInit() {

    this.datos = this._formBuilder.group({
      'nombreCompleto': ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(64)])],
      'correo': ['', Validators.compose([Validators.required, emailValidator])],
      'contrasena': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'repetirContrasena': ['', Validators.compose([Validators.required])]
    }, { validator: matchingPasswords('contrasena', 'repetirContrasena') });

    this.datos.valueChanges.subscribe(() => {
      this.fuerzaDeContrasena = passwordStrength(this.datos.controls['contrasena'].value);
    });
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }


  public fieldValidation(name: any) {
    if (this.datos.get([name]).invalid && this.datos.get([name]).touched) {
      return true;
    }

  }
}
