import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { EstadoCuentaComponent } from './estado-cuenta.component';



export const routes: Routes = [
  { path: '', component: EstadoCuentaComponent, pathMatch: 'full' }
] 

@NgModule({
  declarations: [
    EstadoCuentaComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: []
})
export class EstadoCuentaModule { }