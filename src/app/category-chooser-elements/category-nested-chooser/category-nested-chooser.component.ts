import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodeModel} from '../node-model';

@Component({
  selector: 'app-category-nested-chooser',
  templateUrl: './category-nested-chooser.component.html',
  styleUrls: ['./category-nested-chooser.component.scss']
})
export class CategoryNestedChooserComponent implements OnInit {

  @Output('selected')
  selected = new EventEmitter<NodeModel>();

  @Input('data')
  data: Array<NodeModel> = [];

  constructor() { }

  ngOnInit() {
  }

  childrenSelected(data: NodeModel) {
    this.selected.emit(data);
  }

}
