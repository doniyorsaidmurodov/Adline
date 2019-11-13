import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = null;
  tokenCookie = null;

  constructor(private cookieService: CookieService) {
    this.token = sessionStorage.getItem('token');
    this.tokenCookie = this.cookieService.get('token');
  }

  setToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe === true) {
      this.cookieService.set('token', token, new Date(new Date().getTime() + 30 * 60000));
    }
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    if (this.token === null) {
      this.token = sessionStorage.getItem('token');
    }
    return this.token;
  }

  getTokenFromCookie(): string {
    if (this.tokenCookie === null) {
      this.tokenCookie = this.cookieService.get('token');
    }
    return this.tokenCookie;
  }

  logOut(reload: boolean = false): void {
    if (reload) {
      window.location.reload();
    }
    this.cookieService.delete('token', '/');
    sessionStorage.removeItem('token');
    this.token = null;
    this.tokenCookie = null;
  }
}
