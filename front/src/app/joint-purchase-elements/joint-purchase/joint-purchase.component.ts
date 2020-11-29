import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { RestApiService } from '../../rest-api.service';
import { DataService } from '../../data.service';
import {NgbDateAdapter, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {ModalJoinToJointPurchaseComponent} from '../../modals/modal-join-to-joint-purchase/modal-join-to-joint-purchase.component';
import { ModalRequestEventComponent } from '../../modals/modal-request-event/modal-request-event.component';
import { ModalRequestPaymentComponent } from '../../modals/modal-request-payment/modal-request-payment.component';
import {UploadFileService} from '../../upload-file.service';
import {JointPurchaseHistoryService} from '../../joint-purchase-history.service';
import {CommentModel} from '../comment-elements/comment-model';
import {CommentSettings} from '../comment-elements/comment-settings';
import {SearchFieldService} from '../../search-field.service';
import {ModalLoginComponent} from '../../modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from '../../modals/modal-registration/modal-registration.component';
import { FileUploader } from 'ng2-file-upload';
import {environment} from '../../../environments/environment';

@Injectable()
export class DateNativeAdapter extends NgbDateAdapter<string> {

  fromModel(value: string): NgbDateStruct {
    const date = new Date(value);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  toModel(date: NgbDateStruct): string {
    return new Date(date['year'], date['month'] - 1, date['day']).toDateString();
  }

}

@Component({
  selector: 'app-joint-purchase',
  templateUrl: './joint-purchase.component.html',
  styleUrls: ['./joint-purchase.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: DateNativeAdapter}]
})
export class JointPurchaseComponent implements OnInit {

  private routeSub: Subscription;

  private querySub: Subscription;

  purchaseId: string;

  purchaseInfo: any = {};

  editMode: any = {};

  editModeInfo: any = {};

  deadline_edt: NgbDateStruct;

  additionalTabPane = 'description';

  date = {};

  requests = [];

  history = [];

  visibleHistoryLength = 0;

  blackList = [];

  comments: Array<CommentModel> = [];

  ready = false;

  toggles = {
    paid: {}
  };

  uploader:FileUploader;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal,
    private search: SearchService,
    private searchField: SearchFieldService,
    private spinner: NgxSpinnerService,
    private fileUploader: UploadFileService,
    private purchaseHistoryService: JointPurchaseHistoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.routeSub = this.route.params.subscribe(async (params) => {
      this.purchaseId = params['purchase_id'];

      await this.initialize();

      this.ready = true;
      this.spinner.hide();
    });

    this.searchField.activeScope = this.searchField.SCOPE_PURCHASES;
  }

  async initialize() {
    this.uploader = new FileUploader({ url: environment.apiUrl + "/upload_purchase_goods.php?purchase_id=" + this.purchaseId, removeAfterUpload: false, autoUpload: true });
    const resp = await this.rest.getJointPurchaseById(this.purchaseId);
    await this.loadAdditionalInfo(resp['data']['purchase']);
  }

  get isCreator(): boolean {
    return this.purchaseInfo &&
      this.data.user &&
      this.purchaseInfo['creator']['id'] === this.data.user['id'];
  }

  get isParticipant(): boolean {
    if (this.purchaseInfo && this.data.user) {
      const index = this
        .purchaseInfo['requests']
        .findIndex(request => request['user'] === this.data.user['id']);
      return index !== -1;
    } else {
      return false;
    }
  }

  get isBanned(): boolean {
    return this.isLoggedIn &&
      this.purchaseInfo &&
      this.purchaseInfo['black_list'].findIndex(user => user === this.data.user['id']) !== -1;
  }

  get isOpened(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 0;
    }
  }

  get isCollected(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 1;
    }
  }

  get isClosed(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 2;
    }
  }

  get isLoggedIn(): boolean {
    return !!this.data.user;
  }

  get isPaymentApproved(): boolean {
    if (this.purchaseInfo && this.data.user) {
      const index = this
        .purchaseInfo['requests']
        .findIndex(request => request['user'] === this.data.user['id']);
      if (index !== -1) {
        return this.purchaseInfo['requests'][index]['paid'];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  get isGoodPurchase(): boolean {
    return !!(this.purchaseInfo && this.purchaseInfo['good']);
  }

  get haveEnoughRemainingVolume(): boolean {
    return this.purchaseInfo['remaining_volume'] >= this.purchaseInfo['min_volume'];
  }

  get measurementUnit(): string {
    return this.purchaseInfo['measurement_unit']['name'];
  }

  get totalOrderedVolume(): number {
    return this.purchaseInfo['requests'].reduce((all, value) => all + value['volume'], 0);
  }

  get pricePerUnit(): number {
    return this.purchaseInfo['price_per_unit'];
  }

  get visibleHistory(): Array<any> {
    if (this.visibleHistoryLength === this.history.length) {
      return this.history;
    } else {
      return this.history.slice(0, this.visibleHistoryLength);
    }
  }

  get commentSettings(): CommentSettings {
    const creatorLogin = this.purchaseInfo ? this.purchaseInfo['creator']['login'] : null;
    const canReply = this.isLoggedIn;

    return {
      creatorLogin: creatorLogin,
      canReply: canReply
    };
  }

  get currentUser(): any {
    return this.data.user || {};
  }

  showMoreHistoryItems() {
    if (this.visibleHistoryLength + 5 > this.history.length) {
      this.visibleHistoryLength = this.history.length;
    } else {
      this.visibleHistoryLength += 5;
    }
  }

  async loadAdditionalInfo(purchase_info: any) {
    this.purchaseInfo = purchase_info;
    Object.assign(this.editModeInfo, this.purchaseInfo);

    this.data.setTitle(`${this.purchaseInfo.name} - Совместные закупки`);

    this.requests = await Promise.all(
      this
        .purchaseInfo['requests']
        .map(async (request) => {
          const data = Object.create(request);
          if (request['user']) {
            const resp = await this.rest.getUserById(request['user']);
            data['user'] = resp['data']['user'];
          }

          data['cost'] = request['volume'] * this.purchaseInfo['price_per_unit'];
          return data;
      }));

    this.blackList = await Promise.all(
      this.purchaseInfo['black_list']
        .map(async (userId) => {
          const resp = await this.rest.getUserById(userId);
          return resp['data']['user'];
        })
    );

    await this.loadHistory();
    await this.loadTab();
    await this.loadComments();
  }

  async loadComments() {
    this.comments = (await this.rest.getPurchaseCommentTree(this.purchaseInfo['_id']))['data']['comments'];
  }

  async loadTab() {
    this.querySub = this.route.queryParamMap.subscribe(async (params) => {
      const tab = params.get('tab') || this.additionalTabPane;
      if (!this.isCreator && (tab === 'requests' || tab === 'black_list')) {
        await this.switchTab('description');
      } else {
        this.additionalTabPane = tab;
      }
    });
  }

  async loadHistory() {
    this.data.observableUser.subscribe(async (user) => {
      if (!user) {
        return;
      }

      this.history = [];
      for (const item of this.purchaseInfo['history']) {
        if (item['parameter'].startsWith('fake') && !this.isCreator) {
          continue;
        }
        const blocks = await this.purchaseHistoryService.parseHistoryItem(item);
        this.history.push(Object.assign({blocks}, item));
      }
      this.history.reverse();
      this.visibleHistoryLength = Math.min(this.history.length, 5);
    });
  }

  async purchaseImageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      try {
        const file = fileList[0];
        const pictureUrl = await this
          .fileUploader
          .uploadImage(file);

        const resp = await this
          .rest
          .updatePurchaseInfo(
            this.purchaseInfo['_id'],
            'picture',
            pictureUrl
          );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

  async updateName() {
    if (this.editModeInfo['name']) {
      this.editMode['name'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'name',
          this.editModeInfo['name']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Название закупки не может быть пустой строкой');
    }
  }

  async updateVolume() {
    if (this.editModeInfo['volume']) {
      this.editMode['volume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'volume',
          Number.parseFloat(this.editModeInfo['volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        const message = error.error.meta.message;

        if (message === 'LESSER THAN USED') {
          this
            .data
            .addToast('Товара заказано больше, чем вы пытаетесь установить', '', 'error');
        } else {
          this
            .data
            .addToast('Ошибка', error['message'], 'error');
        }
      }
    } else {
      this
        .data
        .error('Вы не ввели количество товара');
    }
  }

  async updateRequestVolume(request_id, new_volume) {
    if (new_volume) {
      try {
        const resp = await this.rest.updateRequestVolume(
          request_id,
          new_volume
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        const message = error.error.meta.message;

        if (message === 'LESSER THAN USED') {
          this
            .data
            .addToast('Товара недостаточно для заказа', '', 'error');
        } else {
          this
            .data
            .addToast('Ошибка', error['message'], 'error');
        }
      }
    } else {
      this
        .data
        .error('Вы не ввели количество товара');
    }
  }
  
  async updateMinVolume() {
    if (this.editModeInfo['min_volume']) {
      this.editMode['min_volume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'min_volume',
          Number.parseFloat(this.editModeInfo['min_volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        const message = error.error.meta.message;

        if (message === 'GREATER THAN REMAINING') {
          this
            .data
            .addToast('Минимальный объем заказа не может быть больше оставшегося кол-ва товара', '', 'error');
        } else {
          this
            .data
            .addToast('Ошибка', error['message'], 'error');
        }
      }
    } else {
      this
        .data
        .error('Вы не количество товара');
    }
  }

  async updatePricePerUnit() {
    if (this.editModeInfo['price_per_unit']) {
      this.editMode['price_per_unit'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'price_per_unit',
          Number.parseFloat(this.editModeInfo['price_per_unit'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не указали цену');
    }
  }

  async updateDate() {
    if (this.editModeInfo['date']) {
      this.editMode['date'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'date',
          this.deadline_edt.year*10000 + this.deadline_edt.month*100 + this.deadline_edt.day
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не указали дату');
    }
  }

  async updateIsPublicState() {
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'is_public',
        this.purchaseInfo['is_public'] ? 1 : 0
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updateCategory() {
    this.editMode['category'] = false;
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'category',
        this.editModeInfo['category']['_id']
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updateDescription() {
    if (this.editModeInfo['description']) {
      this.editMode['description'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'description',
          this.editModeInfo['description']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Нет описания закупки');
    }
  }

  async updateAddress() {
    if (this.editModeInfo['address']) {
      this.editMode['address'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'address',
          this.editModeInfo['address']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не указали адрес места выдачи товара');
    }
  }

  async updateState(newState: number) {
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'state',
        newState
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updatePaymentInfo() {
    if (
      this.editModeInfo['payment_type'] === 1 &&
      !this.editModeInfo['payment_info'] &&
      this.editModeInfo['payment_info'].length === 0) {
      this
        .data
        .addToast('Укажите платежную информацию', '', 'error');
      return false;
    }

    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'payment_info',
        this.editModeInfo['payment_info']
      );

      if (!resp['meta'].success) {
        this
          .data
          .error(resp['meta'].message);
        return false;
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
      return false;
    }
    return true;
  }

  async updatePaymentType() {
    if (this.editModeInfo['payment_type'] === 1) {
      const updateInfoRes = await this.updatePaymentInfo();

      if (!updateInfoRes) {
        return;
      }
    }
    try {
      this.editMode['payment_type'] = false;

      const typeResp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'payment_type',
        this.editModeInfo['payment_type']
      );

      if (typeResp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(typeResp['data']['purchase']);
      } else {
        this
          .data
          .error(typeResp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async joinToPurchase(fakeUser: boolean = false) {
    const modalRef = this.modalService.open(ModalJoinToJointPurchaseComponent);

    modalRef.componentInstance.purchaseInfo = this.purchaseInfo;
    modalRef.componentInstance.fakeUser = fakeUser;

    modalRef.result.then(async (purchaseInfo) => {
      if (purchaseInfo) {
        await this.loadAdditionalInfo(purchaseInfo);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async showModalRequestEvent(request_id, not_sent) {
    const modalRef = this.modalService.open(ModalRequestEventComponent);

    modalRef.componentInstance.purchaseInfo = this.purchaseInfo;
    modalRef.componentInstance.request_id = request_id;
    modalRef.componentInstance.not_sent = not_sent;

    modalRef.result.then(async (purchaseInfo) => {
      if (purchaseInfo) {
        await this.loadAdditionalInfo(purchaseInfo);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async showModalRequestPayment(request_id, not_paid) {
    const modalRef = this.modalService.open(ModalRequestPaymentComponent);

    modalRef.componentInstance.purchaseInfo = this.purchaseInfo;
    modalRef.componentInstance.request_id = request_id;
    modalRef.componentInstance.not_paid = not_paid;

    modalRef.result.then(async (purchaseInfo) => {
      if (purchaseInfo) {
        await this.loadAdditionalInfo(purchaseInfo);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async detachFromPurchase() {
    try {
      const resp = await this.rest.detachFromPurchase(this.purchaseInfo['_id']);

      if (resp['meta'].success) {
        this
          .data
          .addToast('Вы отсоединились от закупки', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .addToast('Не удалось отсоединиться от закупки', '', 'success');
      }
    } catch (error) {
      const message = error.error.meta.message;

      if (message === 'NOT JOINT') {
        this
          .data
          .addToast('Вы уже не являетесь участником закупки', 'Обновите страницу', 'error');
      } else {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      }
    }
  }

  async deleteRequest(id: number) {
    try {
      const resp = await this.rest.deleteRequest(id);

      if (resp['meta'].success) {
        this
          .data
          .addToast('Заявка удалена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .addToast('Ошибка удаления заявки', '', 'success');
      }
    } catch (error) {
      const message = error.error.meta.message;

      if (message === 'NOT JOINT') {
        this
          .data
          .addToast('Заявка уже удалена', 'Обновите страницу', 'error');
      } else {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      }
    }
  }

  async addUserToBlackList(participantId: string) {
    try {
      const resp = await this.rest.addUserToPurchaseBlackList(
        this.purchaseInfo['_id'],
        participantId
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Пользователь добавлен в черный список', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async removeUserFromBlackList(participantId: string) {
    try {
      const resp = await this.rest.removeUserFromPurchaseBlackList(
        this.purchaseInfo['_id'],
        participantId
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Пользователь разблокирован', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async onCommentSent() {
    await this.loadComments();
  }

  async switchTab(tab: string) {
    await this.router.navigate([], {
      queryParams: {
        tab: tab
      }
    });
  }

  disableEditMode(field: string) {
    this.editMode[field] = false;
    this.editModeInfo[field] = this.purchaseInfo[field];
  }

  get today(): string {
    return this.data.currentDay;
  }

  async fastSignUp() {
    try {
      const signUpRef = this.modalService.open(ModalRegistrationComponent);
      await signUpRef.result;

      await this.fastLogIn();
    } catch (error) {
      console.log(error);
    }
  }

  async fastLogIn() {
    try {
      const logInRef = this.modalService.open(ModalLoginComponent);
      await logInRef.result;
    } catch (error) {
      console.log(error);
    }
  }
}
