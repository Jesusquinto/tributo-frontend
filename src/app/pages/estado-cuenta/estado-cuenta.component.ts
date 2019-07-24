import { UsuarioActo } from './../../modelos/usuario_acto.model';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiRestService } from '../../api-rest.service';
@Component({
  selector: 'app-icons',
  templateUrl: './estado-cuenta.component.html',
  styleUrls: ['./estado-cuenta.component.scss'],
  providers: [ ]
})
export class EstadoCuentaComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;

  public viewpdf: boolean;



  public estadoActo;
  public userNombre: any;
  public settings: Settings;
  public sidenavOpen:boolean = true;
  public actos: Array<UsuarioActo>;
  public acto: UsuarioActo;
  public type:string = 'TO';
  public searchText: string;



  public copy: string;
  constructor(public appSettings:AppSettings, private servicio: ApiRestService) {    this.settings = this.appSettings.settings;   }

  ngOnInit() {
    if(window.innerWidth <= 992){
      this.sidenavOpen = false;
    }
    this.type = 'TO';
    this.viewpdf = false;
    this.settings.loadingSpinner = true;

    this.servicio.getUserData().subscribe(
      (result: any) =>{
        this.userNombre = result.name;
      }
    );


    this.getTributos();


    
  }
  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth <= 992) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getTributos(){
    switch (this.type) {
      case 'TO':
        this.getAllActos();
        break;
      case 'PA':
        this.getActos('PA');
        break;
      case 'PR':
        this.getActos('PR');
      break;
      case 'BO':
        this.getActos('BO');
      break;
      case 'LI':
      this.getActos('LI');
    break;
      default:
        this.getAllActos();
    }  
  }

  public viewDetail(acto : UsuarioActo){ 
    this.acto = null;
    this.estadoActo = "cargando";
    setTimeout(x => {
      this.estadoActo = "cargado";
      /* this.acto = this.servicio.getTributo(acto.id_usuario_acto); TRAER ACTO */
    console.log(acto);
    this.acto = acto;
    this.actos.forEach(m => m.selected = false);
    this.acto.selected = true;

    if(window.innerWidth <= 992){
      this.sidenav.close(); 
    }
     
    }, 300);




    
  }



  



  getActos(type: string){
    this.settings.loadingSpinner = true;
    this.servicio.get('usuariosacto/filter/0/0/0/'.concat(type)).subscribe(
      (result : any) =>{
        this.actos = result;
        this.settings.loadingSpinner = false;

      },
      (error) =>{

      }
    );

  }

  getAllActos(){
    this.settings.loadingSpinner = true;
    this.servicio.get('usuariosacto/usuario').subscribe(
      (result : any) =>{
        
        this.actos = result;
        this.settings.loadingSpinner = false;
      },
      (error) =>{

      }
    );
  };


  

  }
