import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodeModel} from '../node-model';

@Component({
  selector: 'app-internal-category-node',
  templateUrl: './internal-category-node.component.html',
  styleUrls: [ './internal-category-node.component.scss']
})
export class InternalCategoryNodeComponent implements OnInit {

  @Input('data')
  data: NodeModel;

  @Input('level')
  level: number;

  @Output('selected')
  selected = new EventEmitter<NodeModel>();

  constructor() { }

  ngOnInit() { }

  nodeSelected() {
    this.selected.emit(this.data);
  }

  childrenSelected(data: NodeModel) {
    this.selected.emit(data);
  }

  get zIndex(): number {
    return 1100 + this.level;
  }

  get invertMenu(): boolean {
    return Math.trunc(this.level / 2) % 2 === 1;
  }

}
