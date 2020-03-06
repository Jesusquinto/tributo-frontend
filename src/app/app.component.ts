import { Component } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { Event, Router, NavigationStart, NavigationEnd, RouterEvent } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentUrl = '';
  public showLoading = true;

  title = '';
  public settings: Settings;
  constructor(public appSettings:AppSettings, private router: Router){
      this.settings = this.appSettings.settings;
      this.title = this.settings.name;


      this.router.events.subscribe((routerEvent: Event) => {
        if (routerEvent instanceof NavigationStart) {
          this.showLoading = true;
          this.currentUrl = routerEvent.url.substring(routerEvent.url.lastIndexOf('/') + 1);
        }
  ​
        if (routerEvent instanceof NavigationEnd) {
          this.showLoading = false;
        }
        window.scrollTo(0, 0);
      });

    sessionStorage.setItem('so', navigator.appVersion.split('(')[1].split(')')[0]);
    sessionStorage.setItem('browser', this.getBrowserInfo());



     /*  if(window){
        window.console.log=function(){};
        window.console.error=function(){};
        window.console.info= function(){};
        window.console.warn = function(){};
      } */
  }


  getBrowserInfo() {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};

  


}
