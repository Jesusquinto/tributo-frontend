import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { VencimientosComponent } from './vencimientos.component';


export const routes: Routes = [
  { path: '', component: VencimientosComponent, pathMatch: 'full' }
] 

@NgModule({
  declarations: [
    VencimientosComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: []
})
export class VencimientosModule { }