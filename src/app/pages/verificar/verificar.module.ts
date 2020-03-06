import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { VerificarComponent } from './verificar.component';
import { ComponentsModule } from '@componentes';


export const routes: Routes = [
  { path: '', component: VerificarComponent, pathMatch: 'full' }
] 


@NgModule({
  declarations: [
    VerificarComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  entryComponents: []
})
export class VerificarModule {}
