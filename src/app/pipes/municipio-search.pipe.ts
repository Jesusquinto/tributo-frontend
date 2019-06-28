import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MunicipioSearch'
})

export class MunicipioSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(municipio => {
        if(municipio.nombreMunicipio ){
          if(municipio.nombreMunicipio.search(searchText) !== -1 ){
            return true;
          }
        }
      });
    }
  }
}
