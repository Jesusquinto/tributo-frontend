import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { DataService } from './data.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { ApiRestService } from './api-rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor( private router: Router, private servicio: ApiRestService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];
    this.servicio.userIsLogged().subscribe( (result: any ) =>{
      if(result == true){
         
            return true;
      }
  },
  error =>{
    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/login']
      )
    );
      return false;
  })

    /* let flag:any = this.dataService.isLogged();
    if(flag.__zone_symbol__value){
        return true;
    }
    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/login'], {
          queryParams: {
            redirectUrl
          }
        }
      )
    ); */
    return true;
  }
}