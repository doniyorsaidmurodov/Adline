import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import EChartOption = echarts.EChartOption;
import {Campaign} from '../../../models/Campaign';
import {ModalComponent} from '../../components/modal/modal.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent', {static: false}) modalComponent: ModalComponent;
  bsInlineRangeValue: Date[] = [];

  title = 'adline';
  colors = ['#d14a61', '#5793f3', '#69AD71'];
  chartOption: EChartOption;
  chartData: Campaign[] = [];
  currentPeriod = 4;
  currentDates: {
    current: Date;
    second: Date;
  };
  loading = false;
  requestSub: Subscription;
  // requestParams: string = null;

  filtered = [
    {name: 'All', type: 'ALL', value: true},
    {name: 'Google', type: 'GOOGLE_ADWORDS', value: false},
    {name: 'Youtube', type: 'YOUTUBE', value: false},
    {name: 'Yandex', type: 'YANDEX_DIRECT', value: false},
    {name: 'Facebook', type: 'FACEBOOK', value: false},
  ];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.request();
  }

  ngOnDestroy(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  request(type: string = 'ALL'): void {
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

    this.loading = true;
    this.chartData = [];

    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }

    // this.requestParams = JSON.stringify({type, fromDate: secondDate.toISOString(), toDate: currentDate.toISOString()});
    this.requestSub = this.apiService.getChartData(type, secondDate.toISOString(), currentDate.toISOString())
      .subscribe(next => {
        this.loading = false;

        const labels = [];
        const clicks = [];
        const impr = [];
        const ctr = [];

        next.forEach((data, i) => {
          labels[i] = data.id;
          clicks[i] = data.clicks;
          impr[i] = data.impressions;
          ctr[i] = data.clickRate;

          const obj: Campaign = new Campaign(data);
          this.chartData.push(obj);
        });

        this.chartOption = {
          color: this.colors,

          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross'
            },
            alwaysShowContent: true
          },
          grid: {
            left: '25%'
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: labels
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Cliks',
              min: 0,
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: this.colors[1]
                }
              },
              axisLabel: {
                formatter: '{value} '
              }
            },
            {
              type: 'value',
              name: 'Impressions',
              min: 0,
              position: 'left',
              offset: 80,
              axisLine: {
                lineStyle: {
                  color: this.colors[0]
                }
              },
              axisLabel: {
                formatter: '{value} '
              }
            },
            {
              type: 'value',
              name: 'CTR',
              min: 0,
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: this.colors[2]
                }
              },
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [

            {
              name: 'Impressions',
              type: 'bar',
              yAxisIndex: 1,
              data: impr
            },
            {
              name: 'Cliks',
              type: 'bar',
              data: clicks
            },
            {
              name: 'CTR',
              type: 'bar',
              yAxisIndex: 2,
              data: ctr
            }
          ]
        };
      }, error => {
        this.loading = false;

        console.error(error);
      });
  }

  filter(com: string = null) {
    if (com !== null) {
      if (com === 'All') {
        this.filtered.forEach(each => each.value = false);
        this.filtered[0].value = true;
      } else {
        this.filtered[0].value = false;
        this.filtered.filter(each => each.name === com)[0].value = true;
      }
    }
    setTimeout(() => {
      if (!this.filtered.filter(each => each.value).length) {
        this.filtered[0].value = true;
      }
      const type = this.filtered.filter(each => each.value).map(each => each.type).join(',');
      this.request(type);
    }, 200);
  }

  setPeriod(number1: number) {
    if (this.currentPeriod === number1) {
      return;
    }
    this.currentPeriod = number1;
    this.filter();
  }

  apply(event) {
    this.bsInlineRangeValue = event;
    this.currentPeriod = 5;
    this.filter();
  }

  openModal() {
    this.modalComponent.openModal();
  }

  // download() {
  //   sessionStorage.setItem('download', this.requestParams);
  //   sessionStorage.setItem('downloadRoute', 'dashboard');
  //   window.open(window.origin + '/cabinet/download', '_blank');
  // }
}

function dateBack(days: number) {
  const date = new Date();
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
}
