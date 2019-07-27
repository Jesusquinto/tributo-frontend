import { Component } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  public settings: Settings;
  constructor(public appSettings:AppSettings){
      this.settings = this.appSettings.settings;
      this.title = this.settings.name;

     /*  if(window){
        window.console.log=function(){};
        window.console.error=function(){};
        window.console.info= function(){};
        window.console.warn = function(){};
      } */
  } 

  


}
