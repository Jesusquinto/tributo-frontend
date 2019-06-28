import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { EstadoCuentaComponent } from '../../pages/estado-cuenta/estado-cuenta.component';
import { MisContratosComponent } from '../../pages/mis-contratos/mis-contratos.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { VencimientosComponent } from '../../pages/vencimientos/vencimientos.component';
import { DeclararComponent } from '../../pages/declarar/declarar.component';


export const AdminLayoutRoutes: Routes = [  
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'declarar',      component: DeclararComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'vencimientos',         component: VencimientosComponent },
    { path: 'estado-cuenta',          component: EstadoCuentaComponent },
    { path: 'mis-contratos',           component: MisContratosComponent }
];