import {Injectable} from '@angular/core';
import {SearchService} from './search.service';
import {JointPurchaseSearchService} from './joint-purchase-search.service';

export class ScopeModel {

  applyFilters(): void {
    this._filterFn(this.search);
  }

  constructor(
    public readonly name: string,
    public readonly search: any,
    private _filterFn: (search: any) => void = () => {}
  ) { }

}

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {

  constructor(
    private _goodsSearch: SearchService,
    private _purchaseSearch: JointPurchaseSearchService
  ) {
    this.setDefaultScope();
  }

  readonly SCOPE_GOODS = new ScopeModel(
    'Товары',
    this._goodsSearch
  );

  readonly SCOPE_PURCHASES = new ScopeModel(
    'Закупки',
    this._purchaseSearch
  );

  private _activeScope: ScopeModel;

  private _scopes = [
    this.SCOPE_GOODS,
    this.SCOPE_PURCHASES
  ];

  get scopes(): Array<ScopeModel> {
    return this._scopes;
  }

  get activeScope(): ScopeModel {
    return this._activeScope;
  }

  set activeScope(newScope: ScopeModel) {
    this._activeScope = newScope;
  }

  setStoreScope(storeScope: ScopeModel) {
    this._scopes.push(storeScope);
  }

  deleteStoreScope() {
    this._scopes.pop();
    this.setDefaultScope();
  }

  setDefaultScope() {
    this._activeScope = this.SCOPE_GOODS;
  }

}
