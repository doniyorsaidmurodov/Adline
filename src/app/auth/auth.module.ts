import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './auth.component';
import {SharedModule} from '../shared/shared.module';
import { ResetComponent } from './reset/reset.component';
import { FinishComponent } from './finish/finish.component';

@NgModule({
  declarations: [AuthComponent, ResetComponent, FinishComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule {
}
