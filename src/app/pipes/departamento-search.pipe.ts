import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DepartamentoSearch'
})

export class DepartamentoSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(departamento => {
        if(departamento.nombreDepartamentp ){
          if(departamento.nombreDepartamentp.search(searchText) !== -1 ){
            return true;
          }
        }
      });
    }
  }
}
