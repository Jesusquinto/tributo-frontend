import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppImports } from 'src/app/app-imports';
import { MisContratosComponent } from './mis-contratos.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';


export const routes: Routes = [
  { path: '', component: MisContratosComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    MisContratosComponent,

  ],
  imports: [
    AppImports,
    PdfViewerModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: []
})
export class MisContratosModule { };