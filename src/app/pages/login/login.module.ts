import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { LoginComponent } from './login.component';
import { ComponentsModule } from '@componentes';


export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: []
})
export class LoginModule {}
