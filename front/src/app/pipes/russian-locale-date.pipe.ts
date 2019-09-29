import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'russianLocaleDate'
})
export class RussianLocaleDatePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) {
      return '';
    }

    let date = null;
    if (typeof value === 'string') {
      date = new Date(value);
    } else if (value['year'] && value['month'] && value['day']) {
      date = new Date(value['year'], value['month'] - 1, value['day']);
    } else if (
      <Date>value.getDate &&
      <Date>value.getMonth &&
      <Date>value.getFullYear
    ) {
      date = value;
    } else {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

}
