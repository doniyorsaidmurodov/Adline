import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  error = '';
  changeSubs: Subscription;
  modalRef: BsModalRef;

  user: User = null;

  constructor(private modalService: BsModalService, private apiService: ApiService, private authService: AuthService) {
  }

  openModal(modalName: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalName);
  }

  ngOnInit() {
    this.apiService.getAccount().subscribe(userData => {
      this.user = userData;
    }, error => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    if (this.changeSubs) {
      this.changeSubs.unsubscribe();
    }
  }


  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.error = 'Пароли не совпадают!';
      return;
    } else {
      this.error = '';
      this.apiService.changePassword(this.oldPassword, this.newPassword).subscribe(() => {
      }, error => {
        console.log(error);
        return this.error = error.error.localizedMessage;
      }, () => {
        if (!this.error) {
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.newPassword = '';
    this.oldPassword = '';
    this.confirmNewPassword = '';
    this.error = '';
    this.modalRef.hide();
    if (this.changeSubs) {
      this.changeSubs.unsubscribe();
    }
  }

  logOut(): void {
    this.authService.logOut(true);
  }
}
