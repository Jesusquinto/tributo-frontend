import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AppImports } from 'src/app/app-imports';
import { LlaveModal } from 'src/app/components/llaveModal/llaveModal.component';
import { AgregarModal } from 'src/app/pages/representantes/agregar-modal/agregar-modal.component';
import { ComponentsModule } from '@componentes';
import { RepresentanteService } from '@representados';
import { ShowPdfModal } from 'src/app/components/showPdfModal/showPdfModal.component';


@NgModule({
  imports: [
    CommonModule,
    AppImports,
    AdminLayoutRoutingModule,
    ComponentsModule
  ],
  declarations: [
    LlaveModal,
    AgregarModal,
    ShowPdfModal
  ],
  providers: [],
  entryComponents: [
    LlaveModal,
    AgregarModal,
    ShowPdfModal

  ],
})

export class AdminLayoutModule {}
