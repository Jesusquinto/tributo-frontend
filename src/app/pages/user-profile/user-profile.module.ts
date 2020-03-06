import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { UserProfileComponent } from './user-profile.component';
import { ComponentsModule } from '@componentes';


export const routes: Routes = [
  { path: '', component: UserProfileComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  imports: [
    AppImports,
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule

  ],
  entryComponents: []
})
export class UserProfileModule { }