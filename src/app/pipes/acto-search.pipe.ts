import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ActoSearch'
})

export class ActoSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(acto => {
        if(acto.descripcion || acto.fkActoEntidad.codigo){
          if(acto.descripcion.search(searchText) !== -1 || acto.fkActoEntidad.codigo.search(searchText) !== -1){
            return true;
          }
        }
      });
    }
  }
}
