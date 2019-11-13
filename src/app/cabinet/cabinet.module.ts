import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CabinetRoutingModule} from './cabinet-routing.module';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';

import {NgxEchartsModule} from 'ngx-echarts';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

import {MainComponent} from './routes/main/main.component';
import {PlatformsComponent} from './routes/platforms/platforms.component';
import {CampaignsComponent} from './routes/campaigns/campaigns.component';
import {GroupAdsComponent} from './routes/group-ads/group-ads.component';
import {SharedModule} from '../shared/shared.module';
import {LoaderComponent} from './components/loader/loader.component';
import {AdsComponent} from './routes/ads/ads.component';
import {GroupAdsChildComponent} from './routes/group-ads-child/group-ads-child.component';
import {AdsChildComponent} from './routes/ads-child/ads-child.component';
import { ModalComponent } from './components/modal/modal.component';
import { CsvDownloadComponent } from './routes/csv-download/csv-download.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    MainComponent,
    PlatformsComponent,
    CampaignsComponent,
    GroupAdsComponent,
    GroupAdsChildComponent,
    AdsComponent,
    AdsChildComponent,
    ModalComponent,
    CsvDownloadComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    CabinetRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgxEchartsModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
  ]
})
export class CabinetModule {
}
