import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from '../../api-rest.service';
import { RepresentanteService } from '@representados';
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Escritorio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/declarar', title: 'Diligenciar, declarar y pagar',  icon: 'ni-briefcase-24 text-blue', class: '' },
    { path: '/estado-cuenta', title: 'Estado de cuenta',  icon: 'ni-archive-2 text-red', class: '' },
    { path: '/acuerdos-pagos', title: 'Acuerdos de pago',  icon: 'ni-money-coins text-green', class: '' },
    { path: '/mis-contratos', title: 'Contratos suscritos',  icon: 'ni-paper-diploma text-blue', class: '' },
    { path: '/vencimientos', title: 'Vencimientos',  icon: 'ni-time-alarm text-default', class: '' },
    { path: '/user-profile', title: 'Datos persona',  icon: 'ni-single-02 text-primary', class: '' },
    { path: '/representantes', title: 'Representantes legales',  icon: 'ni-badge text-blue', class: '' }
  ];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() public searchMenu: string;
  public menuItems: any[];
  public isCollapsed = true;
  public representados: any;
  public representado: any;

  constructor(private _representados: RepresentanteService, private router: Router,  private servicio: ApiRestService) {
    this.representados = this._representados.representados;
    this.representado = this._representados.representado;
   }
  @Input()
  public profileimg: string;
  public title: string;
  @Input()
  public nombre: string;

  ngOnInit() {






    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
