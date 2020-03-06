import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ActividadSearch'
})

export class ActividadSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(actividad => {
        if (actividad.actividad.codAct || actividad.actividad.descripcion){
          if (actividad.actividad.codAct.search(searchText) !== -1 || actividad.actividad.descripcion.search(searchText) !== -1){
            return true;
          }
        }
      });
    }
  }
}
