import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateFile'
})
export class TruncateFilePipe implements PipeTransform {
  transform(value: string, args?) : string {
    let limit = args > 0 ? parseInt(args) : 10;
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}