import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalLoginComponent} from '../modal-login/modal-login.component';

@Component({
  selector: 'app-modal-reset-password',
  templateUrl: './modal-reset-password.component.html',
  styleUrls: ['./modal-reset-password.component.scss']
})
export class ModalResetPasswordComponent implements OnInit {
  email: string;
  constructor(private rest: RestApiService,
              private data: DataService,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal) { }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validate(): boolean {
    if (this.email) {
      if (this.validateEmail(this.email)) {
        return true;
      } else {
        this
          .data
          .addToast('Ошибка', 'Некорректный email', 'error');
        return false;
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Вы не ввели email', 'error');
      return false;
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  async resetPassword() {
    if (this.validate()) {
      const data = await this
        .rest
        .resetPassword({
          email: this.email,
        });
      if (data['meta'].success) {
        this
          .data.addToast('Пароль успешно сброшен и отправлен Вам на E-mail', '', 'success');
        this.dismiss();
        this.openModalLogin();
      } else {
        this
          .data.addToast('Не удалось сбросить пароль', '', 'error');
      }
    }
  }

  openModalLogin() {
    const modalRef = this
      .modalService
      .open(ModalLoginComponent);

    modalRef
      .result
      .then(async () => {
        await this.data.refreshPage();
      })
      .catch(error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

}
