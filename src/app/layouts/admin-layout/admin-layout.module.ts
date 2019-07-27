import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { EstadoCuentaComponent } from '../../pages/estado-cuenta/estado-cuenta.component';
import { MisContratosComponent } from '../../pages/mis-contratos/mis-contratos.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { VencimientosComponent } from '../../pages/vencimientos/vencimientos.component';
import { DeclararComponent } from '../../pages/declarar/declarar.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from '../../components/components.module'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {MatDatepickerModule} from '@angular/material/datepicker';


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
import { DeclararModule } from '../../pages/declarar/declarar.module'
import { AppImports } from 'src/app/app-imports';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
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
    DeclararModule,
    AppImports,
    NgxMatSelectSearchModule

  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    VencimientosComponent,
    EstadoCuentaComponent,
    MisContratosComponent,
    
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class AdminLayoutModule {}
