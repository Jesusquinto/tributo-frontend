import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router' 
import * as $ from 'jquery';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import Swal from 'sweetalert2';
import { DataService } from '../../data.service';
import { ApiRestService } from 'src/app/api-rest.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private token: any;
  public settings: Settings;2
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  constructor(private ruta : Router, public appSettings: AppSettings, private data: DataService, private servicio: ApiRestService, private activatedRoute: ActivatedRoute ) {
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;


  }

  login(){
    return this.servicio.googleLogin();
  }


  ngOnInit(){
    let token : any = this.ruta.url.split('=');
    if(token[1]){
      this.token= token[1];
      this.data.setToken(this.token);
      this.ruta.navigateByUrl(
        this.ruta.createUrlTree(
          ['/dashboard']
        )
      );
      console.log(this.token);
    }
  
    
  }


  ngOnDestroy() {
  }



}
