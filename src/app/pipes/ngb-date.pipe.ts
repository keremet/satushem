import { Pipe, PipeTransform } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
  name: 'ngbDate'
})
export class NgbDatePipe implements PipeTransform {

  transform(value: string): NgbDateStruct {
    const date = new Date(value);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

}
