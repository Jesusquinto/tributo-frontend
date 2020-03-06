import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AppImports } from 'src/app/app-imports';
import es from '@angular/common/locales/es';
import { MAT_DATE_LOCALE } from '@angular/material';


export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [],

})
export class DashboardModule {}
