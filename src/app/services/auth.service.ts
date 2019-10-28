import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = null;

  constructor() {
    this.token = sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    if (this.token === null) {
      this.token = sessionStorage.getItem('token');
    }
    return this.token;
  }

  logOut(reload: boolean = false): void {
    if (reload) {
      window.location.reload();
    }
    sessionStorage.removeItem('token');
    this.token = null;
  }
}
