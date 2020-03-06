import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';



const AuthLayoutRoutes: Routes = [
    { path: 'login',          loadChildren : '@pages/login#LoginModule'},
    { path: 'verificar/:key', loadChildren : '@pages/verificar#VerificarModule'},
    { path: 'aceptar/:clave', loadChildren : '@pages/confirmar-invitacion#ConfirmarInvitacionModule'}
];
@NgModule({
    imports: [RouterModule.forChild(AuthLayoutRoutes)],
    exports: [RouterModule],
  })
  export class AuthLayouthRoutingModule {
}
