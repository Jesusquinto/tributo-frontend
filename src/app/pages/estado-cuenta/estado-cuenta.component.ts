import { UsuarioActo } from './../../modelos/usuario_acto.model';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiRestService } from '../../api-rest.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { itsPdf } from 'src/app/components/validators/app-validators';

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
  public pdf;
  public estado = 'verTRAMITE';
  public userNombre: any;
  public settings: Settings;
  public sidenavOpen:boolean = true;
  public actos: Array<UsuarioActo>;
  public acto: UsuarioActo;
  public type:string = 'TO';
  public searchText: string;

  @ViewChild('closeDropDown') closeDropDown: any;


  public copy: string;
  constructor(public appSettings:AppSettings, private servicio: ApiRestService) {    this.settings = this.appSettings.settings;   }

  ngOnInit() {
    
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
  

showPdf(){
  console.log(this.acto);
  this.estado = 'verPDF';
  this.pdf = "http://localhost:8090/rest/v1/generarpdf/".concat(this.acto.idUsuarioActo.toString());
  this.sidenavOpen = false;
  this.settings.loadingSpinner = true;

}


pdfCargado(event){
  this.settings.loadingSpinner = false;
}

volver(){
  this.estado = "verTRAMITE";
  this.sidenavOpen = true;
  
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
        console.log(result);
        if(result.length == 0){
          this.estadoActo = "noEncontrado"
          this.acto = null;
        }else{this.estadoActo = 'Listados'}
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
        console.log(result);
        if(result.length == 0){
          this.estadoActo = "noEncontrado"
          this.acto = null;
        }else{this.estadoActo = 'Listados'}
        this.actos = result;
        this.settings.loadingSpinner = false;
      },
      (error) =>{

      }
    );
  };

  test(e){
    this.type = e.value;
    this.getTributos();
  }




  presentarActo(){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        title: 'title2'
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title:  '¿Está seguro?',
      text: '¿De presentar este tramite?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, presentar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
    


    this.settings.loadingSpinner = true;
    this.servicio.put("acto/presentar/"+this.acto.idUsuarioActo, {}).subscribe((result : any) =>{
      this.settings.loadingSpinner = false;
      this.getAllActos();
      this.acto.estado = "PR";
      this.acto.fechaPresentacion = result.fechaPresentacion;
      

    });
       

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La acción se cancelo!',
          'error'
        )
      }
    })



  }


  anularActo(){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        title: 'title2'
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title:  '¿Está seguro?',
      text: '¿De anular este tramite?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, anular!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
    


    this.settings.loadingSpinner = true;
    this.servicio.put("acto/anular/"+this.acto.idUsuarioActo, {}).subscribe((result : any) =>{
      this.settings.loadingSpinner = false;
      this.getAllActos();
      console.log(result);
      this.acto.estado = "AN";
      this.acto.fechaAnulado = result.fechaAnulado;

    });
       

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La acción se cancelo!',
          'error'
        )
      }
    })



  }






}






  

  
