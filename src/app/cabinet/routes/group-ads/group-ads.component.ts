import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Subscription} from 'rxjs';
import {Campaign} from '../../../models/Campaign';
import {PageChangedEvent} from 'ngx-bootstrap';
import {ModalComponent} from '../../components/modal/modal.component';
import {Router} from '@angular/router';
import {formatDate} from '../../../../environments/consts';
import {Page} from '../../../models/Page';

@Component({
  selector: 'app-group-ads',
  templateUrl: './group-ads.component.html',
})
export class GroupAdsComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent', {static: false}) modalComponent: ModalComponent;
  bsInlineRangeValue: Date[] = [];

  adGroupList: Campaign[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;
  requestParams: string = null;

  total = {
    clicks: 0,
    impressions: 0
  };
  currentPeriod = 4;
  currentType = 'GOOGLE_ADWORDS';
  page: Page;
  currentDates: {
    current: Date;
    second: Date;
  };

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    sessionStorage.setItem('currentType', 'GOOGLE_ADWORDS');
    this.getTable(this.currentType, 0);
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  changeTabStatus(status: string) {
    if (this.currentType === status) {
      return;
    }
    this.currentType = status;
    sessionStorage.setItem('currentType', status);
    this.getTable(this.currentType, 0);
  }

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.getTable(this.currentType, 0);
  }

  pageChanged(event: PageChangedEvent): void {
    // console.log('page -->  ' + event.page);
    this.getTable(this.currentType, event.page - 1);
  }

  apply(event) {
    this.bsInlineRangeValue = event;
    this.currentPeriod = 5;
    this.getTable(this.currentType, 0);
  }

  openModal() {
    this.modalComponent.openModal();
  }

  download() {
    sessionStorage.setItem('download', this.requestParams);
    sessionStorage.setItem('downloadRoute', 'ad-groups');
    window.open(window.origin + '/cabinet/download', '_blank');
  }

  more(id: string) {
    sessionStorage.setItem('request', JSON.stringify({
      request: this.requestParams,
      currentType: this.currentType,
      currentPeriod: this.currentPeriod
    }));
    this.router.navigate(['/cabinet/ads', id]).then();
  }

  private getTable(type: string = 'GOOGLE_ADWORDS', page: number) {
    // console.log('get table page --> ' + page);
    let secondDate = null;
    let currentDate = new Date();

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
        currentDate = new Date(this.bsInlineRangeValue[1]);
        secondDate = new Date(this.bsInlineRangeValue[0]);
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
    this.loading = true;
    this.adGroupList = [];

    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }

    this.requestParams = JSON.stringify({
      type,
      fromDate: formatDate(secondDate),
      toDate: formatDate(currentDate),
      page
    });
    sessionStorage.setItem('requestParams', this.requestParams);
    this.requestSub = this.apiService.getAdGroupList(type, formatDate(secondDate), formatDate(currentDate), null, page)
      .subscribe(next => {
        this.page = new Page(next);
        // console.log(next);
        // console.log(this.page);
        this.loading = false;

        next.content.forEach(each => {
          this.total.clicks += each.clicks;
          this.total.impressions += each.impressions;

          const obj: Campaign = new Campaign(each);
          this.adGroupList.push(obj);
        });
      }, error => {
        this.loading = false;

        this.error = error.error.message;
        console.error(error);
      });
  }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
