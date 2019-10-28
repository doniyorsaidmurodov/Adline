import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ads} from '../../../models/Ads';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ads-child',
  templateUrl: './ads-child.component.html',
})
export class AdsChildComponent implements OnInit, OnDestroy {
// modalRef: BsModalRef;

  adList: Ads[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;

  id: number = null;

  total = {
    clicks: 0,
    impressions: 0
  };
  currentPagination = 1;
  currentDates: {
    current: Date;
    second: Date;
  };

  // private modalService: BsModalService,
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.id = route.snapshot.params.id;
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

  private getTable(type: string = 'GOOGLE_ADWORDS') {
    const currentDate = new Date();
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 2);
    this.loading = true;
    this.currentPagination = 1;
    this.adList = [];
    this.apiService.getAdList(type, currentYearStart.toISOString(), currentDate.toISOString(), this.id)
      .subscribe(next => {
        this.loading = false;
        console.log(next);

        next.forEach(each => {
          const obj: Ads = new Ads(each);
          this.adList.push(obj);
        });
      }, error => console.error(error));

    this.currentDates = {
      current: currentDate,
      second: currentYearStart
    };

    this.total = {
      clicks: 0,
      impressions: 0
    };
    // this.loading = true;
    // this.adList = [];
  }
}
