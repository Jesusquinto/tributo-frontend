import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { ApiRestService } from '../../api-rest.service';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('300ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('300ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class NavbarComponent implements OnInit {
  @Input()
  public profileimg: string;
  public title: string;
  @Input()
  
  public nombre: string;
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router, private servicio: ApiRestService) {
    this.location = location;
  }

  ngOnInit() {
   
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.isEscritorio();
  }


  cerrarsesion(){
    
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);

  }





  isEscritorio(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee == '/dashboard'){
      return true;
    }else{
      return false;
    }

  }

  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 2 );
    }
    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    if(titlee == '/user-profile'){
      return 'PERFIL'
    }
    
  }
}
