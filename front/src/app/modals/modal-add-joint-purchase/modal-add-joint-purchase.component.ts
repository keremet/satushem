import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {UploadFileService} from '../../upload-file.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-add-joint-purchase',
  templateUrl: './modal-add-joint-purchase.component.html',
  styleUrls: ['./modal-add-joint-purchase.component.scss']
})
export class ModalAddJointPurchaseComponent implements OnInit {

  @Input('good')
  good: any;

  @Input('store')
  store: any;

  name = new FormControl('', Validators.required);

  description = new FormControl('');

  category = new FormControl(null, Validators.required);

  address = new FormControl('', Validators.required);

  volume = new FormControl('', Validators.required);

  minVolume = new FormControl('', Validators.required);

  pricePerUnit = new FormControl('', Validators.required);

  measurementUnit = new FormControl(null, Validators.required);

  date = new FormControl(null, Validators.required);

  paymentType = new FormControl(null, Validators.required);

  paymentInfo = new FormControl('');

  isPublic = new FormControl(true);

  pictureUrl: string = null;

  picturePath = new FormControl('');

  pictureFile: any = null;

  form: FormGroup;

  btnDisabled = false;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private fileUploader: UploadFileService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      'name': this.name,
      'description': this.description,
      'category': this.category,
      'address': this.address,
      'volume': this.volume,
      'minVolume': this.minVolume,
      'pricePerUnit': this.pricePerUnit,
      'measurementUnit': this.measurementUnit,
      'date': this.date,
      'picturePath': this.picturePath,
      'payment': this.builder.group({
        'paymentType': this.paymentType,
        'paymentInfo': this.paymentInfo
      }, { validator: this.paymentValidator }),
      'isPublic': this.isPublic
    });

    if (this.good) {
      this.fillFieldsForGood();
    }
  }

  fillFieldsForGood() {
    this.name.setValue(this.good['name']);
    this.description.setValue(this.good['description'] || '');
    this.category.setValue(this.good['category']);
    this.measurementUnit.setValue(this.good['measurement_unit']);
    this.minVolume.setValue(this.good['purchase_info']['min_volume']);
    this.pictureUrl = this.good['picture'];
    if (this.good['volume']) {
      this.volume.setValidators([this.volume.validator, Validators.max(this.good['volume'])]);
    }

    if (this.store['goods_type'] === 'retail') {
      this.pricePerUnit.setValue(this.good['price']);
    } else {
      if (this.good['purchase_info']['wholesale_price']) {
        this.pricePerUnit.setValue(this.good['purchase_info']['wholesale_price']);
      } else {
        this.pricePerUnit.setValue(this.good['price']);
      }
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get total(): number {
    const volume = Number.parseFloat(this.volume.value) || 0;
    const price = Number.parseFloat(this.pricePerUnit.value) || 0;
    return volume * price;
  }

  get today(): string {
    return this.data.currentDay;
  }

  paymentValidator(group: FormGroup) {
    const paymentType = group.controls['paymentType'].value;
    const paymentInfo = group.controls['paymentInfo'].value;

    if (paymentType !== 1) {
      return null;
    } else if (paymentType === 1 && !!paymentInfo) {
      return null;
    } else {
      return {
        infoMismatch: true
      };
    }
  }

  imageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.pictureFile = fileList[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.pictureFile);

      reader.onloadend = f_event => {
        this.pictureUrl = f_event.target['result'];
      };
    }
  }

  deleteImage() {
    this.pictureUrl = null;
    this.pictureFile = null;
    this.picturePath.reset();
  }

  updateCategory(category: any) {
    this.category.setValue(category);
  }

  updateUnit(unit: any) {
    this.measurementUnit.setValue(unit);
  }

  async createPurchase() {
    try {
      let pictureUrl;
      if (this.good) {
        pictureUrl = this.good['picture'];
      } else if (this.pictureUrl) {
        pictureUrl = await this.fileUploader.uploadImage(this.pictureFile);
      } else {
        pictureUrl = ''; // default picture's url: 'assets/img/box.svg'
      }
      const {day, month, year} = this.date.value;
      const data = {
        name: this.name.value,
        picture: pictureUrl,
        description: this.description.value,
        category_id: this.category.value['_id'],
        address: this.address.value,
        volume: Number.parseFloat(this.volume.value),
        min_volume: Number.parseFloat(this.minVolume.value),
        price_per_unit: Number.parseFloat(this.pricePerUnit.value),
        measurement_unit_id: this.measurementUnit.value['_id'],
        date: year*10000 + month*100 + day,
        state: 0,
        payment_type: this.paymentType.value,
        payment_info: this.paymentInfo.value,
        is_public: this.isPublic.value ? 1 : 0
      };

      if (this.good) {
        data['good_id'] = this.good['_id'];
      }

      const resp = this.good ? (await this.rest.addGoodJoinPurchase(data)) : (await this.rest.addJointPurchase(data));

      this
        .data
        .addToast('Закупка создана', '', 'success');

      const id = resp['data']['purchase']['_id'];

      await this
        .router
        .navigate(['/purchase', id]);

      this
        .activeModal
        .close();
    } catch (error) {
      const message = error.error.meta.message;
      this
        .data
        .addToast('Ошибка', message, 'error');
    }
  }
}
