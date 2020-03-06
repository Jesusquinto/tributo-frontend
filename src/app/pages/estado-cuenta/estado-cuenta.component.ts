import { UsuarioActo } from './../../modelos/usuario_acto.model';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ApiRestService } from '../../api-rest.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentsModule } from '@componentes';

@Component({
  selector: 'app-icons',
  templateUrl: './estado-cuenta.component.html',
  styleUrls: ['./estado-cuenta.component.scss'],
  providers: [ ]
})
export class EstadoCuentaComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('closeDropDown') closeDropDown: any;

  public viewpdf: boolean;
  private url: any;
  public estadoActo;
  public pdf;
  public estado = 'verTRAMITE';
  public userNombre: any;
  public sidenavOpen: boolean;
  public actos: Array<UsuarioActo>;
  public acto: UsuarioActo;
  public type: string;
  public searchText: string;
  public copy: string;
  public valores: any;

  public displayedColumns: string[] = [ 'referencia', 'valortramite', 'intereses' , 'total'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selection = new SelectionModel<any>(true, []);
  public dataSource: any;
  public itemSelected: any;
  public items: Array<any> = [];
  public gindex: number;

  constructor(private servicio: ApiRestService, private endpoints: EndpointsService) {
      this.dataSource = new MatTableDataSource<any>([]);
      this.url = endpoints.endpoints.value;
      this.sidenavOpen = true;
      this.type = 'TO';
    }

  ngOnInit() {
    this.type = 'TO';
    this.viewpdf = false;
    this.servicio.openSpinner();

    this.servicio.getUserData().subscribe(
      (result: any) => {
        this.userNombre = result.name;
      }
    );
    this.getTributos();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth <= 992) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

showPdf() {
  this.servicio.openSpinner();
  this.servicio.get(`reporte/estampillas/${this.acto.idUsuarioActo}`).subscribe(
    (path: any) => {
      this.pdf = `${this.url.complete}tramite/ver/${path.ruta}`;
      this.estado = 'verPDF';
    },
    error => {this.servicio.closeSpinner(); console.log( error); }
  );
}


pdfCargado(event) {
  this.servicio.closeSpinner();
}

public savePDF() {
  FileSaver.saveAs(this.pdf);
}

volver() {
  this.estado = 'verTRAMITE';
  this.sidenavOpen = true;
}


  public getTributos() {
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

  public viewDetail(acto: UsuarioActo) {
    this.acto = null;
    this.estadoActo = 'cargando';
    this.acto = acto;
    this.servicio.get(`acto/total/${this.acto.idUsuarioActo}`).subscribe(
      valores => {
        this.estadoActo = 'cargado'; this.valores = valores;
        console.log(acto);
        console.log(this.valores);
        this.actos.forEach(m => m.selected = false);
        this.acto.selected = true;
        this.dataSource = [this.valores];
        console.log('datos', this.dataSource);
        if (window.innerWidth <= 992) {
          this.sidenav.close();
        }
      },
      error => { console.log(error); }
    );

      /* this.acto = this.servicio.getTributo(acto.id_usuario_acto); TRAER ACTO */

  }



  getActos(type: string) {
    this.servicio.openSpinner();
    this.servicio.get('usuariosacto/filter/0/0/0/'.concat(type)).subscribe(
      (result: any) => {
        console.log(result);
        if (result.length === 0) {
          this.estadoActo = 'noEncontrado';
          this.acto = null;
        } else {this.estadoActo = 'Listados'; }
        this.actos = result;
        this.servicio.closeSpinner();
      },
      (error) => {
        console.log(error);
        this.servicio.closeSpinner();
      }
    );

  }

  getAllActos() {
    this.servicio.openSpinner();
    this.servicio.get('usuariosacto/usuario').subscribe(
      (result: any) => {
        console.log(result);
        if (result.length === 0) {
          this.estadoActo = 'noEncontrado';
          this.acto = null;
        } else {this.estadoActo = 'Listados'; }
        this.actos = result;
        this.servicio.closeSpinner();
      },
      (error) => {
        console.log(error);
        this.servicio.closeSpinner();
      });
  }

  test(e) {
    this.type = e.value;
    this.getTributos();
  }







  presentarActo() {
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
    this.servicio.openSpinner();
    this.servicio.put('acto/presentar/' + this.acto.idUsuarioActo, {}).subscribe((acto: any) => {
      this.servicio.closeSpinner();
      this.getAllActos();
      this.acto.estado = 'PR';
      this.acto.fechaPresentacion = acto.fechaPresentacion;
    });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La acción se cancelo!',
          'error'
        );
      }
    });
  }

  anularActo() {
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
    this.servicio.openSpinner();
    this.servicio.put('acto/anular/' + this.acto.idUsuarioActo, {}).subscribe((acto: any) =>{
      this.servicio.closeSpinner();
      this.getAllActos();
      console.log(acto);
      this.acto.estado = 'AN';
      this.acto.fechaAnulado = acto.fechaAnulado;
    });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La acción se cancelo!',
          'error'
        );
      }
    });
  }

}
