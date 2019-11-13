import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ApiService} from '../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  public loginForms: FormGroup;
  private readonly next = null;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.next = this.activatedRoute.snapshot.queryParams.next || '';
  }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigate(['/cabinet']).then();
    }
    this.loginForms = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
    });
  }

  public isControlTouched(controlName: string): boolean {
    const control = this.loginForms.controls[controlName];
    return control.touched;
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.loginForms.controls[controlName];
    return control.invalid && control.touched;
  }

  public getControlErrors(controlName: string): object {
    const control = this.loginForms.controls[controlName];
    return control.errors;
  }


  submit() {
    this.submitted = true;
    this.error = null;

    const controls = this.loginForms.controls;

    if (this.loginForms.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    if (!this.agree) {
      return;
    }
    this.loading = true;

    const login = this.loginForms.value.login;
    const password = this.loginForms.value.password;

    this.loading = true;
    this.apiService.login(login, password, this.rememberMe).subscribe(next => {
      this.loading = false;
      this.authService.setToken(next.id_token, this.rememberMe);

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
