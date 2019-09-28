import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedFloat'
})
export class FixedFloatPipe implements PipeTransform {

  transform(value: number, precision: number): string {
    return value.toFixed(precision);
  }

}
