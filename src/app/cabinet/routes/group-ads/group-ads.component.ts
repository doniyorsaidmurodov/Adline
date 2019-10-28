import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Subscription} from 'rxjs';
import {Campaign} from '../../../models/Campaign';

@Component({
  selector: 'app-group-ads',
  templateUrl: './group-ads.component.html',
})
export class GroupAdsComponent implements OnInit, OnDestroy {
  // modalRef: BsModalRef;
  adGroupList: Campaign[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;

  total = {
    clicks: 0,
    impressions: 0
  };
  currentPagination = 1;
  currentPeriod = 4;
  currentType = 'GOOGLE_ADWORDS';
  currentDates: {
    current: Date;
    second: Date;
  };

  // private modalService: BsModalService
  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    sessionStorage.setItem('currentType', 'GOOGLE_ADWORDS');
    this.getTable();
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  setPagination(page: number): void {
    if (page <= 0 || page > Math.ceil(this.adGroupList.length / 10)) {
      return;
    }
    this.currentPagination = page;
  }

  getPaginationList(): Campaign[] {
    /*
    1 -> 1*10 = 0 9
    2 -> 2*10 = 10 19
     */
    return this.adGroupList.filter((e, index) => index >= this.currentPagination * 10 - 10 && index < this.currentPagination * 10);
  }

  changeTabStatus(status: string) {
    if (this.currentType === status) {
      return;
    }
    this.currentType = status;
    sessionStorage.setItem('currentType', status);
    this.getTable(this.currentType);
  }

  private getTable(type: string = 'GOOGLE_ADWORDS') {
    let secondDate = null;
    const currentDate = new Date();

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
    this.currentPagination = 1;

    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }

    this.requestSub = this.apiService
      .getAdGroupList(type, secondDate.toISOString(), currentDate.toISOString())
      .subscribe(next => {
        console.log(next);

        this.loading = false;
        next.forEach(each => {
          this.total.clicks += each.clicks;
          this.total.impressions += each.impressions;

          const obj: Campaign = new Campaign(each);
          this.adGroupList.push(obj);
        });
        console.log(this.adGroupList);
      }, error => {
        this.loading = false;

        this.error = error.error.message;
        console.error(error);
      });
  }

  // openModal(modalName: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(modalName);
  // }
  //
  // apply() {
  //   this.modalRef.hide();
  //   this.setPeriod(5);
  // }

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.getTable(this.currentType);
  }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
