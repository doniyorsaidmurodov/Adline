import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {log} from 'util';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('childModal', {static: false}) childModal: ModalDirective;
  bsInlineRangeValue;
  @Output() apply = new EventEmitter();

  constructor() {
  }

  openModal() {
    this.childModal.show();
    (document.getElementById('datepicker') as HTMLInputElement).value = sessionStorage.getItem('filter');
  }

  closeModal() {
    this.childModal.hide();
  }

  ngOnInit() {
  }

  applied() {
    this.closeModal();
    this.apply.emit(this.bsInlineRangeValue);
    const date = (document.getElementById('datepicker') as HTMLInputElement).value;
    sessionStorage.setItem('filter', date);
  }
}
