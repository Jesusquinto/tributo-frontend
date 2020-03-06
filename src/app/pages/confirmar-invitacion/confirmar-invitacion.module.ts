import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { ConfirmarInvitacionComponent } from './confirmar-invitacion.component';
import { ComponentsModule } from '@componentes';


export const routes: Routes = [
  { path: '', component: ConfirmarInvitacionComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    ConfirmarInvitacionComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  entryComponents: []
})
export class ConfirmarInvitacionModule {}
