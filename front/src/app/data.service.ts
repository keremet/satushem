import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {RestApiService} from './rest-api.service';
import {ToastData, ToastOptions, ToastyConfig, ToastyService} from 'ngx-toasty';
import {BehaviorSubject} from 'rxjs';
import {Title} from '@angular/platform-browser';


@Injectable({providedIn: 'root'})
export class DataService {
  message = '';

  user: any;
  stores: any;
  observableUser = new BehaviorSubject(null);
  categoryTree = new BehaviorSubject([]);

  constructor(private router: Router, private rest: RestApiService, private toastyService: ToastyService,
              private toastyConfig: ToastyConfig, private titleService: Title) {
    this
      .router
      .events
      .subscribe(event => {
        this
          .router
          .events
          .subscribe(event2 => {
            if (event2 instanceof NavigationStart) {
              this.message = '';
            }
          });
      });

    this
      .rest
      .getGoodCategoryTree()
      .then(resp => {
        if (resp['meta'].success) {
          this.categoryTree.next(resp['data']['categories']);
        }
      })
      .catch(err => console.log(err));
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  addToast(title: string, message: string, type: string) {
    const toastOptions: ToastOptions = {
      title: title,
      msg: message,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    switch (type) {
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
    }
  }

  error(message) {
    this.addToast('Ошибка', message, 'error');
  }

  success(message) {
    this.addToast(message, '', 'success');
  }

  warning(message) {
    this.addToast('Внимание', message, 'warning');
  }

  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const profile_data = await this
          .rest
          .getUserProfile();
        this.user = profile_data['data'].user;
        this.observableUser.next(this.user);
      }
    } catch (error) {
      this.error(error);
    }
  }

  clearProfile() {
    this.user = null;
    this.stores = null;
    localStorage.clear();
  }

  get currentDay(): string {
    return new Date().toDateString();
  }

  async refreshPage() {
    const url = this.router.url;
    await this.router.navigateByUrl('/', {skipLocationChange: true});
    await this.router.navigateByUrl(url, {skipLocationChange: true});
  }

}
