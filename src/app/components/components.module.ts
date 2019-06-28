import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';
import { ShowErrorsDirective } from './show-errors/show-errors.component'; 
import { FormsModule } from '@angular/forms';
import { SelectDropdown } from './select-dropdown/select-dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    PipesModule,
    FormsModule,
    PerfectScrollbarModule,
    NgxExtendedPdfViewerModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ShowErrorsDirective,
    SelectDropdown

  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ShowErrorsDirective,
    SelectDropdown
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule { }
