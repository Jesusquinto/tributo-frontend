import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UniqueSearch'
})

export class UniqueSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(e => {
        if(e ){
          if(e.search(searchText) !== -1 ){
            return true;
          }
        }
      });
    }
  }
}
