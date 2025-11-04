import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if(!value) return '';
    let formatted = value.replace(/_/g, ' ');

    return formatted.split(' ').map((str)=>str.charAt(0).toUpperCase() + str.slice(1)).join(' ')
  }

}
