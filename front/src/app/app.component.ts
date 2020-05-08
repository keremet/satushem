import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';

import {DataService} from './data.service';
import {SearchService} from './search.service';
import {RestApiService} from './rest-api.service';
import {Subscription} from 'rxjs';
import {ScopeModel, SearchFieldService} from './search-field.service';
import {Title} from '@angular/platform-browser';
import {JointPurchaseSearchService} from './joint-purchase-search.service';
import {ModalCategoryChooserComponent} from './modals/modal-category-chooser/modal-category-chooser.component';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';

  public isCollapsed = true;

  goods_count = 0;

  cart_sub: Subscription;

  query_params_sub: Subscription;

  route_params_sub: Subscription;

  url = '';

  query = '';

  categories = [];

  chatAdapter: any;

  categoryMenuCollapsed = true;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private data: DataService,
    private search: SearchService,
    private purchaseSearch: JointPurchaseSearchService,
    private rest: RestApiService,
    public searchField: SearchFieldService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
   
  }

  async ngOnInit() {
    await this
      .data
      .getProfile();



    const resp = await this.rest.getAllGoodCategories();
    this.categories = resp['data']['categories'];

    this.query_params_sub = this
      .route
      .queryParamMap
      .subscribe(params => {
        this.query = params.get('query') || '';
      });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnDestroy() {
    this.cart_sub.unsubscribe();
    this.query_params_sub.unsubscribe();
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

  openModalCategoryChooser() {
    const modalRef = this
      .modalService
      .open(ModalCategoryChooserComponent);

    modalRef
      .result
      .then(async (category) => {
        if (category) {
          await this.openSearchByCategory(category);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.data.clearProfile();
    this
      .router
      .navigate(['']);
  }

  get token() {
    return localStorage.getItem('token');
  }

  get chatUserId() {
    return this.data.user._id;
  }

  get isLoggedIn() {
    return this.data.user;
  }

  get categoryTree() {
    return this.data.categoryTree;
  }

  async openSearch() {
    if (!this.router.url.startsWith('/search')) {
      this.searchField.activeScope.search.reset();
    }

    this.searchField.activeScope.search.query = this.query;
    this.searchField.activeScope.applyFilters();
    this.searchField.activeScope.search.navigate();
  }

  onSearchChange(value: string) {
    if (this.router.url.startsWith('/search')) {
      this.searchField.activeScope.search.query = value;
      this.searchField.activeScope.search.navigate();
    }
  }

  get availableScopes(): Array<ScopeModel> {
    return this.searchField.scopes;
  }

  async openSearchByCategory(category: any) {
    this.categoryMenuCollapsed = true;

    this.searchField.activeScope.search.reset();
    this.searchField.activeScope.search.category = { _id: category.id};
    this.searchField.activeScope.search.navigate();
  }
}
