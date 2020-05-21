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

  @Input('fakeUser')
  fakeUser = false;

  @Input('request_id')
  request_id = 0;

  volume: FormControl;

  userLogin: FormControl;

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
    this.volume = new FormControl(this.purchaseInfo['min_volume'], Validators.compose([
      Validators.required,
      Validators.min(this.purchaseInfo['min_volume']),
      Validators.max(this.purchaseInfo['remaining_volume'])
    ]));

	this.eventdate = new FormControl('', Validators.required);
    if (this.fakeUser) {
      this.userLogin = new FormControl('', Validators.required);
    } else {
      this.userLogin = new FormControl('');
    }

    this.form = this.builder.group({
      'volume': this.volume,
      'eventdate': this.eventdate
    });
  }

  updateUserLogin(member: any) {
    this.userLogin.setValue(member);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get cost(): number {
    return this.volume.value * this.purchaseInfo['price_per_unit'];
  }

  volumeValidate(control) {
    const volume = Number.parseFloat(control.value);
    const errors = {};

    if (volume > this.maximum) {
      errors['maximumVolume'] = true;
    }

    control.setErrors(errors);

    return null;
  }

  get maximum(): number {
    return this.purchaseInfo['remaining_volume'];
  }

  get measurementUnit(): string {
    return this.purchaseInfo['measurement_unit']['name'];
  }

  async addEvent() {
    this.btnDisabled = true;

    try {
      const purchaseId = this.purchaseInfo['_id'];
      const volume = Number.parseFloat(this.volume.value);
      const userId = this.userLogin.value['_id'];
	  const {day, month, year} = this.eventdate.value;
      let resp = null;
      if (this.fakeUser) {
        resp = await this.rest.addRequest(purchaseId, userId, volume);
        this
          .data
          .addToast('Заявка добавлена', '', 'success');
      } else {
        resp = await this.rest.addIssue(this.request_id, volume, year*10000 + month*100 + day);
        this
          .data
          .addToast('Выдача зарегистрирована', '', 'success');
      }
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
