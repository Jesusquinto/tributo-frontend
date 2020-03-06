import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayouthRoutingModule } from './auth-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    AuthLayouthRoutingModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [

  ],
  providers: [],
})
export class AuthLayoutModule { }
