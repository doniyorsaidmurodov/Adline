import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  public subscription: Subscription;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    console.log(sessionStorage.getItem('downloadRoute'), sessionStorage.getItem('download'));
    this.subscription = this.apiService
      .getDownload(sessionStorage.getItem('downloadRoute'), sessionStorage.getItem('download'))
      .subscribe(response => {
        if (response.size > 0) {
          const newBlob = new Blob([response], {type: 'application/xlsx'});

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);

          const link = document.createElement('a');
          link.setAttribute('href', data);

          // downloading
          const currDate = new Date();
          const curMonth = currDate.getMonth() + 1;
          let currentMonthString = '';
          if (curMonth < 10) {
            currentMonthString = '0' + curMonth;
          }
          const fileName = currDate.getDate() + '' + currentMonthString + '' + currDate.getFullYear();
          link.download = 'xlsx' + '_' + fileName + '.xlsx';
          link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

          // deleting
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        } else {
          alert('OCCURRED SOME ERROR');
        }
      }, errorResponse => {
        console.error(errorResponse);
      });
  }
}
