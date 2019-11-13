import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './auth.component';
import {SharedModule} from '../shared/shared.module';
import { ResetComponent } from './reset/reset.component';
import { FinishComponent } from './finish/finish.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ConfirmationInfoComponent } from './confirmation-info/confirmation-info.component';
import {CabinetModule} from '../cabinet/cabinet.module';

@NgModule({
  declarations: [AuthComponent, ResetComponent, FinishComponent, ConfirmationInfoComponent, ConfirmationInfoComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CabinetModule
  ]
})
export class AuthModule {
}
