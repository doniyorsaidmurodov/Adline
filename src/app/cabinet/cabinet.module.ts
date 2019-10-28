import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CabinetRoutingModule} from './cabinet-routing.module';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';

import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {NgxEchartsModule} from 'ngx-echarts';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {PaginationModule} from 'ngx-bootstrap/pagination';

import {MainComponent} from './routes/main/main.component';
import {PlatformsComponent} from './routes/platforms/platforms.component';
import {CampaignsComponent} from './routes/campaigns/campaigns.component';
import {GroupAdsComponent} from './routes/group-ads/group-ads.component';
import {SharedModule} from '../shared/shared.module';
import {LoaderComponent} from './components/loader/loader.component';
import {AdsComponent} from './routes/ads/ads.component';
import {GroupAdsChildComponent} from './routes/group-ads-child/group-ads-child.component';
import { AdsChildComponent } from './routes/ads-child/ads-child.component';


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
    AdsChildComponent
  ],
  imports: [
    CommonModule,
    CabinetRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgxEchartsModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
  ]
})
export class CabinetModule {
}
