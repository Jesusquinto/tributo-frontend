import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppSettings } from './app.settings';


import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppImports } from './app-imports';
import {  LOCALE_ID } from '@angular/core';


import { registerLocaleData } from '@angular/common';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { RepresentanteService } from '@representados';
import es from '@angular/common/locales/es';
import { APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { EndpointsService } from './services/endpoints.service';
import { environment } from '../environments/environment';

export function EndpointsLoader(endpointsService: EndpointsService) {
  return () => endpointsService.load(environment.endpoints);
}


registerLocaleData(es);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MDBBootstrapModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: true,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-primary'
  }),

  PdfViewerModule,
  AppImports
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  providers: [AppSettings, { provide: LOCALE_ID, useValue: 'es-ES' },
  {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
  EndpointsService,
    {
      provide   : APP_INITIALIZER,
      useFactory: EndpointsLoader,
      deps      : [EndpointsService],
      multi     : true
    }],
  bootstrap: [AppComponent],

})
export class AppModule { }
