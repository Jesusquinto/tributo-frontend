import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ContratanteSearch'
})

export class ContratanteSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(contratante => {
        if(contratante.fkContratante.nombreContratante ){
          if(contratante.fkContratante.nombreContratante.search(searchText) !== -1 ){
            return true;
          }
        }
      });
    }
  }
}
