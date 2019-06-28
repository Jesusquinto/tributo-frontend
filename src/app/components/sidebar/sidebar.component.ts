import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from '../../api-rest.service';


declare interface RouteInfo {
  
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Escritorio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/declarar', title: 'Diligenciar, declarar y pagar',  icon:'ni-briefcase-24 text-blue', class: '' },
    { path: '/estado-cuenta', title: 'Estado de cuenta',  icon:'ni-archive-2 text-red', class: '' }];

    

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  @Input() public searchMenu: string = '';
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router,  private servicio: ApiRestService) { }
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
