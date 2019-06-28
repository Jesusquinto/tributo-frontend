import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { trigger,style,transition,animate,keyframes,query,stagger,group, state, animateChild } from '@angular/animations';

//MODELS
import { Settings } from '../../../app.settings.model';
import { selectDropdownModel } from '../../../components/select-dropdown/select-dropdown.model';

import Swal from 'sweetalert2';

import { ApiRestService } from '../../../api-rest.service';

@Component({
  selector: 'app-verEntidades',
  templateUrl: './ver-entidades.component.html',
  styleUrls: ['./ver-entidades.component.scss'],
})
export class VerEntidadesComponent implements OnInit {

    @Output() verActos = new EventEmitter();
    viewActos(entidad: any) {
        this.entidad= entidad;
        this.verActos.emit(entidad.idEntidad);
    }  

  @Input()
  public entidades: any;
  @Input()
  public entidad: any;



  public settings: Settings;
  constructor(public appSettings: AppSettings, private servicio: ApiRestService) { 
    this.settings = this.appSettings.settings;
  }

   ngOnInit() {


  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }


}
