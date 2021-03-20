import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-join-to-joint-purchase',
  templateUrl: './modal-join-to-joint-purchase.component.html',
  styleUrls: ['./modal-join-to-joint-purchase.component.scss']
})
export class ModalJoinToJointPurchaseComponent implements OnInit {
  @Input('purchaseInfo')
  purchaseInfo: any;

  @Input('fakeUser')
  fakeUser = false;

  @Input('purchase_good_id')
  purchase_good_id = null;

  @Input('measurement_unit_name')
  measurement_unit_name = null;

  @Input('price_per_unit')
  price_per_unit = null;

  volume: FormControl;

  userLogin: FormControl;

  form: FormGroup;

  btnDisabled = false;

  constructor(
    private rest: RestApiService,
    private activeModal: NgbActiveModal,
    private data: DataService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.volume = this.purchaseInfo.is_multi_good ?
      new FormControl('1') :
      new FormControl(this.purchaseInfo['min_volume'], Validators.compose([
        Validators.required,
        Validators.min(this.purchaseInfo['min_volume']),
        Validators.max(this.purchaseInfo['remaining_volume'])
      ]));

    if (this.fakeUser) {
      this.userLogin = new FormControl('', Validators.required);
    } else {
      this.userLogin = new FormControl('');
    }

    this.form = this.builder.group({
      'volume': this.volume,
      'userLogin': this.userLogin
    });
  }

  updateUserLogin(member: any) {
    this.userLogin.setValue(member);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get cost(): number {
    return this.volume.value *
        (this.purchaseInfo.is_multi_good ? this.price_per_unit : this.purchaseInfo['price_per_unit']);
  }

  volumeValidate(control) {
    if (this.purchaseInfo.is_multi_good)
      return null;

    const volume = Number.parseFloat(control.value);
    const errors = {};

    if (volume < this.minimum) {
      errors['minimumVolume'] = true;
    } else if (volume > this.maximum) {
      errors['maximumVolume'] = true;
    }

    control.setErrors(errors);

    return null;
  }

  get minimum(): number {
    return this.purchaseInfo['min_volume'];
  }

  get maximum(): number {
    return this.purchaseInfo['remaining_volume'];
  }

  get measurementUnit(): string {
    return this.purchaseInfo.is_multi_good ? this.measurement_unit_name : this.purchaseInfo['measurement_unit']['name'];
  }

  async joinToPurchase() {
    this.btnDisabled = true;

    try {
      const purchaseId = this.purchaseInfo['_id'];
      const volume = Number.parseFloat(this.volume.value);
      const userId = this.userLogin.value['_id'];

      let resp = null;
      if (this.fakeUser) {
        resp = await this.rest.addRequest(purchaseId, userId, volume, this.purchase_good_id);
        this
          .data
          .addToast('Заявка добавлена', '', 'success');
      } else {
        resp = await this.rest.joinToPurchase(purchaseId, volume, this.purchase_good_id);
        this
          .data
          .addToast('Вы присоединены к закупке', '', 'success');
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
