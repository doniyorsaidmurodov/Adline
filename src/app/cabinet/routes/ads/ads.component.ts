import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {Ads} from '../../../models/Ads';
import {ModalComponent} from '../../components/modal/modal.component';
import {formatDate} from '../../../../environments/consts';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
})
export class AdsComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent', {static: false}) modalComponent: ModalComponent;
  bsInlineRangeValue: Date[] = [];

  adList: Ads[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;
  requestParams: string = null;
  total = {
    clicks: 0,
    impressions: 0
  };
  currentPeriod = 4;
  currentDates: {
    current: Date;
    second: Date;
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getTable();
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.getTable();
  }

  private getTable(type: string = 'GOOGLE_ADWORDS') {
    let secondDate = null;
    let currentDate = new Date();

    this.loading = true;
    this.adList = [];

    switch (this.currentPeriod) {
      case 1:
        // const date = new Date();
        // const day = date.getDay();
        // const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        // secondDate = new Date(date.setDate(diff));
        secondDate = dateBack(7);
        break;
      case 2:
        // secondDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        secondDate = dateBack(30);
        break;
      case 3:
        secondDate = dateBack(30 * 3);
        break;
      case 4:
        secondDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      case 5:
        currentDate = this.bsInlineRangeValue[1];
        secondDate = this.bsInlineRangeValue[0];
        break;
      default:
        secondDate = new Date(currentDate.getFullYear(), 0, 1);
        this.currentPeriod = 4;
    }
    this.currentDates = {
      current: currentDate,
      second: secondDate
    };

    this.total = {
      clicks: 0,
      impressions: 0
    };

    this.requestParams = JSON.stringify({type, fromDate: formatDate(secondDate), toDate: formatDate(currentDate)});
    sessionStorage.setItem('requestParams', this.requestParams);
    this.apiService.getAdList(type, String(secondDate), String(currentDate))
      .subscribe(next => {
        this.loading = false;

        next.content.forEach(each => {
          const obj: Ads = new Ads(each);
          this.adList.push(obj);
        });
      }, error => console.error(error));

  }

  apply(event) {
    this.bsInlineRangeValue = event;
    this.currentPeriod = 5;
    this.getTable();
  }

  openModal() {
    this.modalComponent.openModal();
  }

  download() {
    sessionStorage.setItem('download', this.requestParams);
    sessionStorage.setItem('downloadRoute', 'ads');
    window.open(window.origin + '/cabinet/download', '_blank');
  }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
