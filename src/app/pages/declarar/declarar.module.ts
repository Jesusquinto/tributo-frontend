import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';



import { ClipboardModule } from 'ngx-clipboard';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


import { DeclararComponent } from '../../pages/declarar/declarar.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from '../../components/components.module'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';


import { PipesModule } from '../../pipes/pipes.module'

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {MatTooltipModule} from '@angular/material/tooltip';
import { VerEntidadesComponent } from './ver-entidades/ver-entidades.component'
import { VerActosComponent } from './ver-actos/ver-actos.component';
import { VerFormularioComponent } from './formulario/ver-formulario.component'
import { VerRangosComponent } from './ver-rangos/ver-rangos.component';
import { FiltrosComponent } from './filtros/filtros.component';

import { MatSelectModule, MAT_DATE_LOCALE, MatNativeDateModule, MatInputModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ComponentsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SweetAlert2Module,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    PipesModule,
    MatFormFieldModule,
    NgxExtendedPdfViewerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatInputModule,
    PdfViewerModule


  ],
  declarations: [
    DeclararComponent,
    VerEntidadesComponent,
    VerActosComponent,
    VerFormularioComponent,
    VerRangosComponent,
    FiltrosComponent
    
    
  ],
  exports:[
    DeclararComponent,
    VerEntidadesComponent,
    VerFormularioComponent,
    VerRangosComponent,
    FiltrosComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    MatDatepickerModule

  ]
})

export class DeclararModule {}
