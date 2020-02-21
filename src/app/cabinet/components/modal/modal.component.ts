import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('childModal', {static: false}) childModal: ModalDirective;
  @Output() apply = new EventEmitter();

  constructor() {
  }

  openModal() {
    this.childModal.show();
    (document.getElementById('datepicker1') as HTMLInputElement).value = sessionStorage.getItem('filter1');
    (document.getElementById('datepicker2') as HTMLInputElement).value = sessionStorage.getItem('filter2');
  }

  closeModal() {
    this.childModal.hide();
  }

  ngOnInit() {
  }

  applied() {
    this.closeModal();
    const tmpDate1 = ((document.getElementById('datepicker1') as HTMLInputElement).value).split('/');
    const tmpDate2 = ((document.getElementById('datepicker1') as HTMLInputElement).value).split('/');
    const date1 = tmpDate1[2] + '/' + tmpDate1[1] + '/' + tmpDate1[0];
    const date2 = tmpDate2[2] + '/' + tmpDate2[1] + '/' + tmpDate2[0];
    this.apply.emit([date1, date2]);
    sessionStorage.setItem('filter1', date1);
    sessionStorage.setItem('filter2', date2);
  }
}
