import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Campaign} from '../../../models/Campaign';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {ActivatedRoute} from '@angular/router';
import {PageChangedEvent} from 'ngx-bootstrap';
import {ModalComponent} from '../../components/modal/modal.component';
import {formatDate} from '../../../../environments/consts';
import {Page} from '../../../models/Page';

@Component({
  selector: 'app-group-ads-child',
  templateUrl: './group-ads-child.component.html',
})
export class GroupAdsChildComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent', {static: false}) modalComponent: ModalComponent;
  bsInlineRangeValue: Date[] = [];

  adGroupList: Campaign[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;
  requestParams: string = null;

  id: number = null;

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

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
    const request = JSON.parse(sessionStorage.getItem('request'));
    this.currentType = request.currentType || 'GOOGLE_ADWORDS';
    this.currentPeriod = request.currentPeriod || 4;
    this.bsInlineRangeValue[0] = JSON.parse(request.request).startDate;
    this.bsInlineRangeValue[1] = JSON.parse(request.request).endDate;
    this.getTable(this.currentType);
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  private getTable(type: string = 'GOOGLE_ADWORDS', page: number = 0) {
    let secondDate = null;
    let currentDate = new Date();

    switch (this.currentPeriod) {
      case 1:
        secondDate = dateBack(7);
        break;
      case 2:
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

    this.requestParams = JSON.stringify({type, fromDate: secondDate, toDate: currentDate, campaignId: this.id, page});
    this.requestSub = this.apiService.getAdGroupList(type, formatDate(secondDate), formatDate(currentDate), this.id, page)
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

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.getTable(this.currentType);
  }

  pageChanged(event: PageChangedEvent): void {
    this.getTable(this.currentType, event.page - 1);
  }


  apply(event) {
    this.bsInlineRangeValue = event;
    this.currentPeriod = 5;
    this.getTable(this.currentType);
  }

  openModal() {
    this.modalComponent.openModal();
  }

  download() {
    sessionStorage.setItem('download', this.requestParams);
    sessionStorage.setItem('downloadRoute', 'ad-groups');
    window.open(window.origin + '/cabinet/download', '_blank');
  }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
