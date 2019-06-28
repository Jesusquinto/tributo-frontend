import { Component, OnInit } from '@angular/core';
import { ApiRestService } from 'src/app/api-rest.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor(private servicio : ApiRestService) { }
  public profileimg : any;
  public nombre : any;
  ngOnInit() {
    this.servicio.getUserData().subscribe(
      (result: any)=>{
        this.profileimg = result.imageUrl;
        this.nombre = result.name
      }
    )
  }

}
