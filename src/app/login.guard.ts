import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { DataService } from './data.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { ApiRestService } from './api-rest.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {

  constructor(private servicio: ApiRestService, private router: Router) {
  }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];      
    this.servicio.userIsLogged().subscribe( (result: any ) =>{
        if(result == true){
            this.router.navigateByUrl(
                this.router.createUrlTree(
                  ['/dashboard']
                )
              );
              return false;
        }
    },
    error =>{
        return true;
    })
  
    return true;
  }
}