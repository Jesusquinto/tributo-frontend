import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MenuSearch'
})

export class MenuSearch implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(menuItem => {
        if(menuItem.title){
          if(menuItem.title.search(searchText) !== -1){
            return true;
          }
        }
      });
    }
  }
}
