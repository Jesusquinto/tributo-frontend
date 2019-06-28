
// show-errors.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { selectDropdownModel } from './select-dropdown.model'

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'select-dropdown',
    template: `
    <li class="nav-item" ngbDropdown placement="bottom" style="width: 100% !important">
    <a class="" role="button" ngbDropdownToggle>
        <label class="form-control-label" for="input-id">{{label}}</label>
        <select id="input-id" class="form-control form-control-alternative" ><option value=" Selection().value" style="display:none">{{ Selection().name}}</option></select>
    </a>
    <div class="dropdown-menu-arrow dropdown-menu-right" style="width: 100% !important" ngbDropdownMenu>
      <div class=" dropdown-header noti-title">     
        <h6 class="text-overflow m-0">Seleccione una de las opciones</h6>
      </div>

      <perfect-scrollbar style="max-height: 300px;">


      <a *ngFor="let dato of datos"  (click)="changedSelection(dato)" class="dropdown-item"    [ngClass]="{'selected' : selection.value == dato.value}"    >
        <i class={{dato.icon}}></i>
        <span>{{dato.name}}</span>
      </a>
      </perfect-scrollbar>
    </div>
  </li>

 `,
    styles: [` a:hover{cursor: pointer; } a:active{color : white !important} select{width: 100%}select:hover{cursor: pointer;}.selected{background: #5e72e4!important;color: white !important;}
`]
})

export class SelectDropdown {
    @Output() changeSelection = new EventEmitter();
    changedSelection(dato: selectDropdownModel) {
        this.selection = dato;
        this.changeSelection.emit(dato);
    }
    @Input()
    public datos: selectDropdownModel[];
    @Input()
    public label: string;
    @Input()
    public defaultLabel: string;
    @Input()
    public selection: selectDropdownModel;
    Selection() {
        if (this.selection == undefined) {
            this.selection = new selectDropdownModel('', 'Seleccione una de las opciones', '');
        }
        return this.selection;
    }



}
