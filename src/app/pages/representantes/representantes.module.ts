import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { RepresentantesComponent } from './representantes.component';
import { Permisos } from './permisos/permisos.component';


export const routes: Routes = [
  { path: '', component: RepresentantesComponent, pathMatch: 'full' }
] 

@NgModule({
  declarations: [
    RepresentantesComponent,
    Permisos
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [Permisos]
})
export class RepresentantesModule { }