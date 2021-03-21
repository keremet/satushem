import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {NgbDateAdapter, NgbDateStruct, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-request-event',
  templateUrl: './modal-request-event.component.html',
  styleUrls: ['./modal-request-event.component.scss']
})
export class ModalRequestEventComponent implements OnInit {
  @Input('purchaseInfo')
  purchaseInfo: any;

  @Input('request')
  request: any;

  volume: FormControl;

  form: FormGroup;

  btnDisabled = false;

  eventdate: FormControl;
  
  constructor(
    private rest: RestApiService,
    private activeModal: NgbActiveModal,
    private data: DataService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.volume = new FormControl(this.request['not_sent']);
    const now = new Date();
    const d = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.eventdate = new FormControl(d);
    this.form = this.builder.group({
      'volume': this.volume,
      'eventdate': this.eventdate
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get cost(): number {
    return this.volume.value * this.request['price'];
  }

  get measurementUnit(): string {
    return this.request['u_name'];
  }

  async addEvent() {
    this.btnDisabled = true;

    try {
      const volume = Number.parseFloat(this.volume.value);
      const {day, month, year} = this.eventdate.value;
      let resp = await this.rest.addIssue(this.request['_id'], volume, year*10000 + month*100 + day);
      this
        .data
        .addToast('Выдача зарегистрирована', '', 'success');
      this
        .activeModal
        .close(resp['data']['purchase']);
    } catch (error) {
        const message = error.error.meta.message;
        this
          .data
          .addToast('Ошибка', message, 'error');
    }

    this.btnDisabled = false;
  }
}
