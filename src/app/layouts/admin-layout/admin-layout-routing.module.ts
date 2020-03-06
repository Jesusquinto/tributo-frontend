import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      loadChildren:  '@pages/dashboard#DashboardModule'},
    { path: 'declarar',       loadChildren:  '@pages/declarar#DeclararModule' },
    { path: 'user-profile',   loadChildren: '@pages/profile#UserProfileModule'},
    { path: 'vencimientos',   loadChildren: '@pages/vencimientos#VencimientosModule' },
    { path: 'estado-cuenta',  loadChildren: '@pages/estado-cuenta#EstadoCuentaModule'  },
    { path: 'mis-contratos',  loadChildren: '@pages/mis-contratos#MisContratosModule'},
    { path: 'representantes', loadChildren: '@pages/representantes#RepresentantesModule'},
    { path: 'acuerdos-pagos', loadChildren: '@pages/acuerdos-pagos#AcuerdosPagosModule'}
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule],
  })
  export class AdminLayoutRoutingModule {
  }