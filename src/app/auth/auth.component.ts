import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  login = '';
  password = '';
  submitted = false;
  error: string = null;
  loading = false;
  agree = false;
  private readonly next = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.next = this.activatedRoute.snapshot.queryParams.next || '';
  }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigate(['/cabinet']).then();
    }
  }

  submit() {
    this.submitted = true;
    this.error = null;

    if (this.login.length < 3 || this.password.length < 3) {
      return;
    }
    if (!this.agree) {
      return;
    }

    this.loading = true;
    this.apiService.login(this.login, this.password).subscribe(next => {
      this.loading = false;
      this.authService.setToken(next.id_token);

      if (this.next) {
        this.router.navigate([this.next]).then();
      } else {
        this.router.navigate(['/cabinet']).then();
      }
    }, error => {
      this.loading = false;
      this.error = error.error.localizedMessage;
      this.authService.logOut();
    });
  }

  agreeToConditions(agree: boolean) {
    this.agree = agree;
  }
}
