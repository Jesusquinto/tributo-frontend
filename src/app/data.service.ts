import { Injectable } from '@angular/core';
import { ApiRestService } from './api-rest.service';
import { async } from 'q';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private servicio: ApiRestService) { }


  setToken(token: any): void {
    sessionStorage.setItem('user', token);
  }

  setUserProfileAlert(){
    localStorage.setItem('UserProfileAlert', 'true');
  }

  geUserProfileAlert(){
    if(localStorage.getItem('UserProfileAlert')){
      return true; 
    }else{
      return false
    }
  }



  
  
}
