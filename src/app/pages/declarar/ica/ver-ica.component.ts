import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiRestService } from '../../../api-rest.service';
import {MatDialog, } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@authService';
import { RepresentanteService } from '@representados';
import { trigger, style, transition, animate } from '@angular/animations';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { LlaveModal } from 'src/app/components/llaveModal/llaveModal.component';


@Component({
  selector: 'app-ver-ica',
  templateUrl: './ver-ica.component.html',
  styleUrls: ['./ver-ica.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ],
})
export class VerIcaComponent implements OnInit {


  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
      title: 'title2'
    },
    buttonsStyling: false,
  });


  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  private validarPermisosAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos para crear borradores',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };


  private validarPermisosFirmarAlert: any = {
    title: 'No está autorizado!',
    text: 'Actualmente no tiene permisos para firmar tramites',
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Salir',
    reverseButtons: true,
  };



  private guardarBorradorAlert: any = {
    title: '¿Estás seguro de guardar este borrador?',
    text: 'Podras seguir editandolo si quieres!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, guardar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true,
  };



  private generarFirmaAlert: any = {
    title: '¿Estás seguro de generar una llave del tramite actual?',
    text: 'Se enviará a su correo ' + this.auth.obtenerDatosToken(sessionStorage.getItem('token')).email + '!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true,
};

    @Input() public acto: any;
    @Input() public tributos: any;
    @Input() public tramite: any;
    @Output() Anular = new EventEmitter();
    public actividadFilter: string;
    public datos: FormGroup;
    public representado: any;
    public actividadesContribuyente: Array<any>;
    public actividades: Array<any>;
    public total: any;
    public basesGravables: any;

    public liquidacionPrivada: Array<any>;
    public pagos: Array<any>;

    public nombre: any;
    public identificacion: any;
    public dv: any;

    public totalActividades: any;
    public totalIngresos: any;

  constructor(public appSettings: AppSettings, private servicio: ApiRestService,
              private _formBuilder: FormBuilder, private auth: AuthService,
               public dialog: MatDialog, public router: Router, private _representados: RepresentanteService,
               private endpoints: EndpointsService) {

                this.nombre = this.auth.obtenerDatosToken(sessionStorage.getItem('token')).nombre;
                this.identificacion = this.auth.obtenerDatosToken(sessionStorage.getItem('token')).identificacion;

                this.actividadFilter = '';
                this.total = 0;
/*                 let tarifaKilovatio = 0;
                this.actividades.map(a => a.actividad.descripcion === 'kilovatio' ? tarifaKilovatio = a.tarifa : tarifaKilovatio = 0); */


              this.basesGravables = [
                {name : '9.- INGRESOS BRUTO PERCIBIDOS EN EL PERIODO A DECLARAR', prefix: 'IB' , valor: 0},
                {name : '10.- MENOS: INGRESOS PERCIBIDOS FUERA DEL MUNICIPIO',  prefix: 'IF', valor: 0},
                {name : '11.- MENOS: DEVOLUCIONES, REBAJAS Y DESCUENTOS, VENTAS ANULADAS, RESCINDIDAS O RESUELTAS', prefix: 'DR', valor: 0},
                {name : '12.- MENOS: INGRESOS NO SUJETOS O ACTIVIDDADES NO SUJETAS', prefix: 'IS', valor: 0},
                {name : '13.- MENOS: INGRESOS POR VENTA DE ACTIVOS FIJOS', prefix: 'VA', valor: 0},
                {name : '14.- MENOS: INGRESOS PERCIBIDOS POR ACTIVIDAD PRIMARIA O EXCLUSIONES', prefix: 'IP', valor: 0},
                {name : '15.- IMPUESTO ICA - GENERADORES DE ENERGIA - CAPACIDAD INSTALADA ', prefix: 'CI' , kv: 0,  valor: 0}
              ];

              this.liquidacionPrivada = [
                {name : '16.- TOTAL IMPUESTO DE INDUSTRIA Y COMERCIO DEL PERIODO', prefix: 'IC' , valor: 0},
                {name : '17.- TOTAL IMPUESTO DE AVISOS Y TABLEROS', prefix: 'AT' , valor: 0},
                {name : '18.- TOTAL UNIDADES COMERCIALES ADICIONALES', prefix: 'UC' , valor: 0},
                {name : '.- TOTAL IMPUESTO A CARGO DEL PERIODO', prefix: 'CI', valor: 0},
                {name : '19.- MENOS: RETENCIONES QUE LE PRACTICARON EN EL PERIODO', prefix: 'RP' , valor: 0},
                {name : '20.- MENOS: SALDO A FAVOR DEL PERIODO ANTERIOR', prefix: 'SF' , valor: 0},
                {name : '22.- MENOS:  ANTICIPO LIQUIDADO EN EL PERIODO ANTERIOR', prefix: 'AI' , valor: 0},
                {name : '23.- MAS: ANTICIPO DEL PERIODO A DECLARAR', prefix: 'AP' , valor: 0},
                {name : '24.- MAS: SANCION DE EXTEMPORANEIDAD', prefix: 'SP' , valor: 0},
                {name : '25.- MAS: OTRAS SANCIONES.', prefix: 'OS' , valor: 0},
                {name : '26.- MENOS: EXENCIONES DE IMPUESTOS', prefix: 'EX' , valor: 0},
                {name : '27.- MENOS: IMPUESTOS PAGADOS BIMESTRALMENTE ', prefix: 'DB' , valor: 0},
                {name : '28.- MAS: IMPUESTOS DEJADOS DE DECLARAR BIMESTRALMENTE. ', prefix: 'ID' , valor: 0},
                {name : '29.- TOTAL SALDO A CARGO DEL PERIODO ', prefix: 'SC' , valor: 0},
                {name : '30.- TOTAL SALDO A FAVOR DEL PERIODO', prefix: 'SA' , valor: 0},
              ];

              this.pagos = [
                {name : '31. TOTAL IMPUESTO NETO A PAGAR', prefix: 'IM', valor: 0},
                {name : '36. TOTAL SALDO A PAGAR. ', prefix: 'TP', valor: 0}
              ];

                this.actividadesContribuyente = [{
                    codigoActividad: null,
                    ingresosGravables: 0,
                    tarifa: 0,
                    total: 0
                }];

                console.log(this.tramite);

    this.actividades = [];
    this.datos = this._formBuilder.group({
      'direccion': ['', Validators.compose([Validators.required])],
      'direccionPrincipal': ['', Validators.compose([Validators.required])],
      'actividadEconomica': ['', Validators.compose([Validators.required])],
      'numeroResolucion': ['', Validators.compose([Validators.required])],
      'fechaExpedicion': ['', Validators.compose([Validators.required])],
    });
  }


  ngOnInit() {
    console.log('tramiteeeeeee', this.tramite);
    this._representados.representado.subscribe( value => this.representado = value);
    this.getActividades();
  }




  isEdit() {
    if (this.tramite) {
      this.actividadesContribuyente = JSON.parse(this.tramite.detalleIca).descripcionActividad;
      this.basesGravables = JSON.parse(this.tramite.detalleIca).liquidacion;
      this.pagos = JSON.parse(this.tramite.detalleIca).pagos;
      this.liquidacionPrivada = JSON.parse(this.tramite.detalleIca).liquidacionPrivada;
      this.datos.patchValue({...JSON.parse(this.tramite.detalleIca).informacionDeclarante});
        this.actividadesContribuyente.forEach(ac => {
          this.actividades.forEach(a => {
            if (a.actividad.descripcion === ac.codigoActividad.actividad.descripcion) { ac.codigoActividad = a; }
          });
        });
        this.calcularTotal();
    }
  }


  isPrime(num) {
    const i = num + 1;
    return i % 2;
  }

  agregarActividad() {
    this.actividadesContribuyente.push({
      codigoActividad: null,
      ingresosGravables: 0,
      tarifa: 0,
      total: 0
    });
  }

  eliminarActividad(index: any) {
    console.log(index);
    this.actividadesContribuyente.splice(index, 1);
    this.calcularTotal();
    }

    setTarifa(a: any) {
      a.tarifa = a.codigoActividad.tarifa;
      console.log(this.actividadesContribuyente);
      this.calcularColumna(a);
    }


  getActividades() {
    this.servicio.openSpinner();
    const url: string = JSON.parse(this.acto.fkBcEntidad.urlPredial1).url;
    console.log(this.acto);
    this.servicio.get(`tarifa/entidad/${this.acto.fkBcEntidad.idEntidad}`).subscribe(
      (result: any) => {this.servicio.closeSpinner(); this.actividades = result; this.isEdit();
        console.log(result)},
      error => {this.servicio.closeSpinner(); console.log(error); }
    );
  }

  calcularColumna(a: any) {
    a.total = Math.round((a.ingresosGravables * a.tarifa) / 100);
    console.log(a.total);
    this.calcularTotal();
  }

  calcularTotal() {
    let totalIngresos = 0;
    let totalActividades = 0;
    this.actividadesContribuyente.map(a => totalActividades = a.total + totalActividades);
    this.basesGravables.map(b => {
      if (b.prefix === 'IB') {
        totalIngresos += b.valor;
        } else {
          totalIngresos -= b.valor;
        }

        if (b.prefix === 'CI') {
          let tarifa = 0;
          this.actividades.map( a => a.actividad.descripcion === 'kilovatio' ? tarifa = a.tarifa : tarifa = 0 );
          b.valor = b.kv * tarifa;
          console.log(b.valor);
        }
    });


    if (totalIngresos < 0) {
      totalIngresos = 0;
    }

    if (totalActividades < 0) {
      totalActividades = 0;
    }

    this.totalActividades = totalActividades;
    this.totalIngresos = totalIngresos;

    this.liquidacionPrivada.map(l => {
      if (l.prefix === 'IC' ) {
        l.valor = this.totalActividades;
      }
      if (l.prefix === 'AT') {
        l.valor = (this.totalActividades * 15 / 100);
      }
      if (l.prefix === 'CI') {
        l.valor = this.liquidacionPrivada[0].valor + this.liquidacionPrivada[1].valor +  this.liquidacionPrivada[2].valor;
      }
    });


    this.pagos.map( p => {
      if (p.prefix === 'IM') {
        p.valor = this.liquidacionPrivada[0].valor + this.liquidacionPrivada[1].valor +  this.liquidacionPrivada[2].valor;
      }
      if (p.prefix === 'TP') {
        p.valor = this.pagos[0].valor + this.totalActividades + this.liquidacionPrivada[0].valor;
      }

    });


  }


  anular() {
    this.Anular.emit(this.tramite);
 }


  guardarBorrador() {
    this.swalWithBootstrapButtons.fire(this.guardarBorradorAlert).then(
      (result) => {
      if (result.value) {
        this.calcularTotal();
        console.log(this.actividadesContribuyente);
        if (!this.datos.valid) {
          this.swalWithBootstrapButtons.fire(
            'Datos incorrectos',
            'Revise el formulario y vuelva a intentarlo!',
            'error'
          );
          Object.keys(this.datos.controls).forEach(controlName => this.datos.controls[controlName].markAsTouched());
          return;
        }
        if (!this.actividadesContribuyente.some(a => a.codigoActividad && a.ingresosGravables)) {
          this.swalWithBootstrapButtons.fire(
            'No ha ingresado ninguna actividad',
            'Debe agregar actividades economicas!',
            'error'
          );
          return;
        }


        if (this.totalIngresos !== this.totalActividades) {
          this.swalWithBootstrapButtons.fire(
            'Inconsistencia en los datos',
            'Los campos en rojo no concuerdan!',
            'error'
          );
          return;
        }



        if (this.tramite) {
          this.editar();
        } else {
          this.crear();
        }
      }
    });
  }


  editar() {
    const actividades: Array<any> = [];
    this.actividadesContribuyente.forEach(a => {
      if (a.codigoActividad && a.ingresosGravables) {
        actividades.push(a);
      }
    });

    const data = {
      idUsuarioActo : this.tramite.idUsuarioActo,
      fkActoEntidad : this.acto.idActoEntidad,
      detalleIca : JSON.stringify({
        informacionDeclarante : {...this.datos.value},
        descripcionActividad : actividades,
        liquidacion : this.basesGravables,
        liquidacionPrivada : this.liquidacionPrivada,
        pagos : this.pagos
      }),
      valorActo : this.pagos[1].valor,

    };
    this.servicio.openSpinner();
    this.servicio.post('acto/ica/new', data).subscribe(
          (tramite: any) => {this.servicio.closeSpinner(); this.tramite = tramite;
            this.Toast.fire({
              type: 'success',
              title: 'Genial!',
              text: 'Se ha actualizado el acto de I.C.A. con exito!'
          });
        },
    error => {this.servicio.closeSpinner();
        this.Toast.fire({
        type: 'error',
        title: 'Error',
        text: error.error.mensaje
        });
    });


    console.log(data);


  }

  crear() {
    const actividades: Array<any> = [];
    this.actividadesContribuyente.forEach(a => {
      if (a.codigoActividad && a.ingresosGravables > 0) {
        actividades.push(a);
      }
    });

    const data = {
      fkActoEntidad : this.acto.idActoEntidad,
      detalleIca : JSON.stringify( {
        informacionDeclarante : {...this.datos.value},
        descripcionActividad : actividades,
        liquidacion : this.basesGravables,
        liquidacionPrivada : this.liquidacionPrivada,
        pagos : this.pagos
      }),
      valorActo : this.pagos[1].valor,

    };
    this.servicio.openSpinner();
    this.servicio.post('acto/ica/new', data).subscribe(
          (tramite: any) => {this.servicio.closeSpinner(); this.tramite = tramite;
            this.Toast.fire({
              type: 'success',
              title: 'Genial!',
              text: 'Se ha creado el acto de I.C.A. con exito!'
          });
        },
    error => {this.servicio.closeSpinner();
        this.Toast.fire({
        type: 'error',
        title: 'Error',
        text: error.error.mensaje
        });
    });
    console.log(data);

  }







  generarLlave() {
    this.swalWithBootstrapButtons.fire(this.generarFirmaAlert).then((res) => {
      if (res.value) {
          this.servicio.openSpinner();
          this.servicio.post('generarllave/'.concat(this.tramite.idUsuarioActo), {}).subscribe(
            (result: any) => {
              this.servicio.closeSpinner();
              if (result.estado === 0) {
                this.Toast.fire({
                  type: 'success',
                  title: 'Genial!',
                  text: 'Se ha generado la llave del tramite '.concat(result.consecutivoActo).concat(' con exito!')
                });
              }
              this.openDialog(result.estado, result.fechaExpiracion, this.auth.obtenerDatosToken(sessionStorage.getItem('token')));
              console.log(result);
            },
            error => {
              this.servicio.closeSpinner();
              this.Toast.fire({
                type: 'error',
                title: 'Error!',
                text: 'Hubo un error al generar la llave'
                });
            });
        }
      });
  }


  openDialog(estado: any, fecha: Date, usuario: any): void {
    const dialogRef = this.dialog.open(LlaveModal, {
      width: '450px',
      disableClose : true ,
      data: { 'tramite' : this.tramite , 'usuario' : usuario, 'estado': estado, 'fechaExpiracion': fecha}
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result.estado === 0) {
          this.tramite.estado = 'PR';
        }
    });
  }




}
