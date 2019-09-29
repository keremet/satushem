import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-measurement-unit-chooser',
  templateUrl: './measurement-unit-chooser.component.html',
  styleUrls: ['./measurement-unit-chooser.component.scss']
})
export class MeasurementUnitChooserComponent implements OnInit {

  menu_visible = false;

  units: Array<any>;

  new_unit_name: string;

  private _unit: any;

  @Input('unit')
  set unit(value: any) {
    this._unit = value;
    this.selected_unit = this.unit || {};
  }

  get unit(): any {
    return this._unit;
  }

  @Input('readonly')
  readonly = false;

  selected_unit = {};

  @Output('unitChanged')
  unitChanged = new EventEmitter();

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    const resp = await this.rest.getAllMeasurementUnits();
    this.units = resp['data']['units'];

    this.selected_unit = this.unit || {};
  }

  selectUnit(unit: any) {
    this.hideMenu();
    if (this.selected_unit['_id'] !== unit['_id']) {
      this.selected_unit = unit;
      this.unitChanged.emit(this.selected_unit);
    }
  }

  toggleMenu() {
    if (!this.readonly) {
      this.menu_visible = !this.menu_visible;
    }
  }

  hideMenu() {
    this.menu_visible = false;
  }

  async addNewUnit() {
    const index = this
      .units
      .findIndex(category => category.name === this.new_unit_name);
    if (index !== -1) {
      this
        .data
        .addToast('Ошибка', 'Такая единица измерения уже есть', 'error');
      return;
    }
    try {
      const resp = await this.rest.addMeasurementUnit({
        name: this.new_unit_name
      });

      if (resp['meta'].success) {
        this.units.push(resp['data']['unit']);
        this.new_unit_name = '';
        this.selectUnit(this.units[this.units.length - 1]);
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error.toString(), 'error');
    }
  }

}
