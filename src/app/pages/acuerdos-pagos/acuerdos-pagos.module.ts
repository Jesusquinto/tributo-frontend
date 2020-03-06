import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { AcuerdosPagosComponent } from './acuerdos-pagos.component';


export const routes: Routes = [
  { path: '', component: AcuerdosPagosComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AcuerdosPagosComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: []
})
export class AcuerdosPagosModule { }