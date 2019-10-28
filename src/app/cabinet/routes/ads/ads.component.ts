import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {Ads} from '../../../models/Ads';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
})
export class AdsComponent implements OnInit, OnDestroy {
// modalRef: BsModalRef;

  adList: Ads[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;

  total = {
    clicks: 0,
    impressions: 0
  };
  currentPagination = 1;
  currentPeriod = 4;
  currentDates: {
    current: Date;
    second: Date;
  };

  // private modalService: BsModalService,
  constructor(private apiService: ApiService) {
  }

  // openModal(modalName: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(modalName);
  // }

  ngOnInit() {
    this.getTable();
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  setPagination(page: number): void {
    if (page <= 0 || page > Math.ceil(this.adList.length / 10)) {
      return;
    }
    this.currentPagination = page;
  }

  getPaginationList(): Ads[] {
    /*
    1 -> 1*10 = 0 9
    2 -> 2*10 = 10 19
     */
    return this.adList.filter((e, index) => index >= this.currentPagination * 10 - 10 && index < this.currentPagination * 10);
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
    const currentDate = new Date();
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 2);
    this.loading = true;
    this.currentPagination = 1;
    this.adList = [];
    this.apiService.getAdList(type, currentYearStart.toISOString(), currentDate.toISOString())
      .subscribe(next => {
        this.loading = false;
        console.log(next);

        next.forEach(each => {
          const obj: Ads = new Ads(each);
          this.adList.push(obj);
        });
      }, error => console.error(error));

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
    // this.loading = true;
    // this.adList = [];
  }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
