import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-good-category-chooser',
  templateUrl: './good-category-chooser.component.html',
  styleUrls: ['./good-category-chooser.component.scss']
})
export class GoodCategoryChooserComponent implements OnInit {

  menu_visible = false;

  /*new_category_name: string;*/

  private _category: any;

  private _showAll = false;

  @Input('category')
  set category(value: any) {
    this._category = value;
    this.selected_category = value || {};
  }

  @Input('readonly')
  readonly = false;

  @Input('showAll')
  set showAll(value: boolean) {
    this._showAll = value;
  }

  get showAll(): boolean {
    return this._showAll;
  }

  selected_category = {};

  @Output('categoryChanged')
  categoryChanged = new EventEmitter();

  constructor(
    private data: DataService
  ) { }

  async ngOnInit() {
    this.selected_category = this._category || {};
  }

  get categories() {
    return this.data.categoryTree;
  }

  selectCategory(category: any) {
    this.hideMenu();
    if (this.selected_category['_id'] !== category['id']) {
      this.selected_category = {
        _id: category['id'],
        name: category['name']
      };
      this.categoryChanged.emit(this.selected_category);
    }
  }

  toggleMenu() {
    if (!this.readonly) {
      this.menu_visible = !this.menu_visible;
    }
  }

  hideMenu() {
    this.menu_visible = false;
  }
/*
  async addNewCategory() {
    const index = this
      .categories
      .findIndex(category => category.name === this.new_category_name);
    if (index !== -1) {
      this
        .data
        .addToast('Ошибка', 'Такая категория уже есть', 'error');
      return;
    }
    try {
      const resp = await this.rest.addGoodCategory({
        name: this.new_category_name
      });

      if (resp['meta'].success) {
        this.categories.push(resp['data']['category']);
        this.new_category_name = '';
        this.selectCategory(this.categories[this.categories.length - 1]);
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error.toString(), 'error');
    }
  }
*/
}
