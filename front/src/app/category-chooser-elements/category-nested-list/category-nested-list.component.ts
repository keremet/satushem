import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodeModel} from '../node-model';

export class Settings {
  selectOnlyLeafs: boolean;
  description: string;
  backToTopTitle: string;
  limitHeight: boolean;
}

@Component({
  selector: 'app-category-nested-list',
  templateUrl: './category-nested-list.component.html',
  styleUrls: ['./category-nested-list.component.scss']
})
export class CategoryNestedListComponent implements OnInit {

  @Output('selected')
  selected = new EventEmitter<NodeModel>();

  @Input('settings')
  settings: Settings = {
    selectOnlyLeafs: false,
    description: 'Категории',
    backToTopTitle: 'Назад',
    limitHeight: true
  };

  @Input('data')
  set data(items: Array<NodeModel>) {
    this.activeItem = {
      id: null,
      name: this.settings.description,
      children: items
    };
  }

  @Input('showAll')
  set showAll(value: boolean) {
    const all: NodeModel = {
      id: null,
      name: 'Все',
      children: []
    };
    all['all'] = true;

    if (this.activeItem.children.length !== 0) {
      if (value && !this.activeItem.children[0]['all']) {
        this.activeItem.children = [all].concat(
          this.activeItem.children
        );
      } else if (!value && this.activeItem.children[0]['all']) {
        this.activeItem.children.splice(0, 1);
      }
    }
  }

  activeItem: NodeModel = {
    id: null,
    name: this.settings.description,
    children: []
  };

  history: Array<NodeModel> = [];

  constructor() { }

  ngOnInit() {
  }

  showSubitems(event: Event, item: NodeModel) {
    event.stopPropagation();

    this.history.push(this.activeItem);
    this.activeItem = item;
  }

  itemSelected(event: Event, item: NodeModel) {
    event.stopPropagation();

    if (!this.settings.selectOnlyLeafs || item.children.length === 0) {
      this.selected.emit(item);
    }
  }

  backToTop(event: Event) {
    event.stopPropagation();

    this.activeItem = this.history.pop();
  }

}
