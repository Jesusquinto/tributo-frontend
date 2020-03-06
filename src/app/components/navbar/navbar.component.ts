import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { ApiRestService } from '../../api-rest.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '@authService';
import { RepresentanteService } from '@representados';
import { MatDialog } from '@angular/material/dialog';
import { RepresentadosModal } from '../representadosModal/representadosModal.component';
import { share, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
  public representados: any;
  public representado: any;
  constructor(location: Location,   public dialog: MatDialog, private router: Router,
               private servicio: ApiRestService, private auth: AuthService, private _representados: RepresentanteService) {
    this.location = location;
  }

  ngOnInit() {
    this._representados.representado.subscribe(value => {this.representado = value; console.log('cambió', value)});
    this._representados.representados.subscribe(value => this.representados = value);

    this.servicio.openSpinner();
    this.servicio.get('representantes/representados').subscribe(
      result => {this.servicio.closeSpinner(), this.representados = result, console.log('representados', result); },
      error => {this.servicio.closeSpinner(), console.log(error); }
    );


    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.isEscritorio();
    if (this.profileimg == null) {
      this.profileimg = 'assets/resources/users/profileimg.jpg';
    }
  }


  cerrarsesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }


  representar(): void {
    const dialogRef = this.dialog.open(RepresentadosModal, {
      width: '450px',
      disableClose : true ,
      data: { 'representados': this.representados , 'representado': this.representado }
    });
    dialogRef.afterClosed().subscribe(result => {

      switch (result.estado) {
        case 0:
          this._representados.setRepresentado(result.representado);
        break;
      }

    });
  }



  isEscritorio() {
    let titlee: any = this.location.prepareExternalUrl(this.location.path()).split('/');
    titlee = '/'.concat(titlee[titlee.length - 1]);

    if (titlee === '/dashboard') {
      return true;
    } else {
      return false;
    }
  }

  getTitle() {
    let titlee: any = this.location.prepareExternalUrl(this.location.path()).split('/');
    titlee = '/'.concat(titlee[titlee.length - 1]);

    if (titlee.charAt(0) === '#') {
        titlee = titlee.slice( 2 );
    }

    for (let item = 0; item < this.listTitles.length; item++) {
        if (this.listTitles[item].path === titlee) {
            return this.listTitles[item];
        }
    }

  }


}
