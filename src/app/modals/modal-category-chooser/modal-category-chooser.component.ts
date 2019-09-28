import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Settings} from '../../category-chooser-elements/category-nested-list/category-nested-list.component';
import {NodeModel} from '../../category-chooser-elements/node-model';

@Component({
  selector: 'app-modal-category-chooser',
  templateUrl: './modal-category-chooser.component.html',
  styleUrls: ['./modal-category-chooser.component.scss']
})
export class ModalCategoryChooserComponent implements OnInit {

  settings: Settings = {
    selectOnlyLeafs: false,
    description: 'Категории',
    backToTopTitle: 'Назад',
    limitHeight: false
  };

  constructor(
    private data: DataService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }

  get categories() {
    return this.data.categoryTree;
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  result(category: NodeModel) {
    this.activeModal.close(category);
  }

}
