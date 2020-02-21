import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {Platform} from '../../../models/Platform';
import {ModalComponent} from '../../components/modal/modal.component';
import {formatDate} from '../../../../environments/consts';

@Component({
  selector: 'app-platforms',
  templateUrl: './platforms.component.html',
})
export class PlatformsComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent', {static: false}) modalComponent: ModalComponent;
  bsInlineRangeValue: Date[] = [];

  adList: Platform[] = [];
  loading = false;
  error: string = null;
  requestSub: Subscription;
  // requestParams: string = null;

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

  private getTable() {
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

    this.apiService.getPlatformList(formatDate(secondDate), formatDate(currentDate))
      .subscribe(next => {
        this.loading = false;

        next.forEach(each => {
          const obj: Platform = new Platform(each);
          this.adList.push(obj);
        });
      }, error => console.error(error));
  }

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.getTable();
  }

  apply(event) {
    this.bsInlineRangeValue = event;
    this.currentPeriod = 5;
    this.getTable();
  }

  openModal() {
    this.modalComponent.openModal();
  }

  // download() {
  //   sessionStorage.setItem('download', this.requestParams);
  //   sessionStorage.setItem('downloadRoute', 'platforms');
  //   window.open(window.origin + '/cabinet/download', '_blank');
  // }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
