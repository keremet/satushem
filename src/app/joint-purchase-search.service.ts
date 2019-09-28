import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {RestApiService} from './rest-api.service';
import {DataService} from './data.service';
import {Router} from '@angular/router';
import {parse, stringify} from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class JointPurchaseSearchService {

  result = new Subject();

  private _filter: any;

  private _query: string;

  private _url: string;

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private router: Router
  ) {
    this.reset();
  }

  reset() {
    this._filter = {};
    this._query = '';
    this._url = '';

    this.page_number = 1;
  }

  get PAGE_SIZE() {
    return 5;
  }

  get page_number(): number {
    if (this._filter['page_number']) {
      return this._filter['page_number'];
    } else {
      return 1;
    }
  }

  set page_number(value: number) {
    if (value > 0) {
      this._filter['page_number'] = value;
    }
  }

  get query(): string {
    return this._query;
  }

  set query(value: string) {
    this._query = value;
  }

  get filter(): any {
    const obj = {};
    return Object.assign(obj, this._filter);
  }

  set filter(value: any) {
    this._filter = Object.assign({}, value);
  }

  get category(): any {
    return {'_id': this._filter['category']};
  }

  set category(value: any) {
    if (value && value['_id']) {
      this._filter['category'] = value['_id'];
    } else {
      delete this._filter['category'];
    }
  }

  get pricing(): any {
    return {
      min: this._filter['min_price'],
      max: this._filter['max_price']
    };
  }

  set pricing(value: any) {
    const min = value['min'] || 0;
    const max = value['max'] || '';

    this._filter['min_price'] = min;
    this._filter['max_price'] = max;
  }

  get volume(): number {
    return Number.parseFloat(this._filter['volume'] || 0);
  }

  set volume(value: number) {
    if (value >= 0) {
      this._filter['volume'] = value;
    }
  }

  get min_volume(): number {
    return Number.parseFloat(this._filter['min_volume'] || 0);
  }

  set min_volume(value: number) {
    if (value >= 0) {
      this._filter['min_volume'] = value;
    }
  }

  get date(): any {
    if (this._filter['date']) {
      const date = this._filter['date'];

      const day = Number.parseInt(date.slice(0, 2));
      const month = Number.parseInt(date.slice(2, 4));
      const year = Number.parseInt(date.slice(4, 8));
      return {
        day, month, year
      };
    } else {
      return {};
    }
  }

  set date(value: any) {
    if (value['day'] && value['month'] && value['year']) {
      const day = value['day'].toString().padStart(2, '0');
      const month = value['month'].toString().padStart(2, '0');
      const year = value['year'];

      this._filter['date'] = `${day}${month}${year}`;
    }
  }

  navigate() {
    const urlTree = this.router.createUrlTree(['/search/purchase'], {
      queryParams: {
        query: this.query,
        filter: stringify(this.filter)
      }
    });
    const url = this.router.serializeUrl(urlTree);

    this
      .router
      .navigateByUrl(urlTree)
      .then((success) => {
        if (success) {
          this._url = url;
        }
      })
      .catch(() => {
      });

    return false;
  }

  set url(value: string) {
    if (this._url !== value && value.startsWith('/search/purchase')) {
      const params = this.router.parseUrl(value).queryParamMap;
      this.reset();
      this.query = params.get('query') || '';
      this.filter = parse(params.get('filter') || '');
      this._url = value;
    }
  }

  invoke(query: string, filter: string, pageNumber: number, pageSize: number = null) {
    pageSize = pageSize || this.PAGE_SIZE;

    this
      .rest
      .searchJointPurchases(
        pageNumber, pageSize, query, filter
      )
      .then(resp => {
        if (resp['meta'].success) {
          this.result.next({
            'purchases': resp['data']['purchases'],
            'total': resp['data']['total']
          });
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }
      })
      .catch(error => {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      });
  }
}
