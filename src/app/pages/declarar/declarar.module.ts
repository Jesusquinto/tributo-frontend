import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


import { DeclararComponent } from '../../pages/declarar/declarar.component';

import { ComponentsModule } from '../../components/components.module'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { VerEntidadesComponent } from './ver-entidades/ver-entidades.component';
import { VerActosComponent } from './ver-actos/ver-actos.component';
import { VerEstampillasComponent } from './estampilas/ver-estampillas.component';
import { VerRangosComponent } from './ver-rangos/ver-rangos.component';
import { FiltrosComponent } from './filtros/filtros.component';

import { MatSelectModule, MAT_DATE_LOCALE, MatNativeDateModule, MatInputModule } from '@angular/material';
import { AppImports } from '@imports';
import { RepresentanteService } from '@representados';
import { VerPredialComponent } from './predial/ver-predial.component';
import { VerVehicularComponent } from './vehicular/ver-vehicular.component';
import { VerIcaComponent } from './ica/ver-ica.component';

export const routes: Routes = [
  { path: '', component: DeclararComponent, pathMatch: 'full' }
];




@NgModule({
  imports: [
    CommonModule,
    AppImports,
    RouterModule.forChild(routes),
    ComponentsModule

  ],
  declarations: [
    DeclararComponent,
    VerEntidadesComponent,
    VerActosComponent,
    VerEstampillasComponent,
    VerPredialComponent,
    VerRangosComponent,
    FiltrosComponent,
    VerVehicularComponent,
    VerIcaComponent
  ],
  exports: [
    DeclararComponent,
    VerEntidadesComponent,
    VerEstampillasComponent,
    VerPredialComponent,
    VerIcaComponent,
    VerRangosComponent,
    FiltrosComponent,
    VerVehicularComponent
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
