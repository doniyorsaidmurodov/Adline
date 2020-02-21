import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formatDate, host} from '../../environments/consts';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  // user
  login(username: string, password: string, rememberMe: boolean = false) {
    return this.http.post<any>(host + 'authenticate', {username, password, rememberMe});
  }

  getAccount() {
    const token = this.authService.getToken();
    return this.http.get<User>(host + 'account', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

  changePassword(currentPassword: string, newPassword: string) {
    const token = this.authService.getToken();
    return this.http.post(host + 'account/change-password', {currentPassword, newPassword}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

  requestPasswordReset(mail: string) {
    return this.http.post(host + 'account/reset-password/init', {mail});
  }

  finishPasswordReset(key: string, newPassword: string) {
    return this.http.post(host + '/account/reset-password/finish', {key, newPassword});
  }

  // platform
  getAdGroupList(type: string, fromDate: string, toDate: string, campaignId: number = null, page: number, size: number = 10) {
    const token = this.authService.getToken();
    let body = null;
    if (campaignId) {
      body = {type, fromDate, toDate, campaignId, page, size};
    } else {
      body = {type, fromDate, toDate, page, size};
    }
    return this.http.get<any>(host + 'ad-groups', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }, params: body
    });
  }

  getAdList(type: string, fromDate: string, toDate: string, adGroupId: number = null, page: number = 0, size: number = 10) {
    const token = this.authService.getToken();
    let body = null;
    if (adGroupId) {
      body = {type, fromDate, toDate, adGroupId, page, size};
    } else {
      body = {type, fromDate, toDate, page, size};
    }
    return this.http.get<any>(host + 'ads', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      }, params: body
    });
  }

  getPlatformList(fromDate: string, toDate: string) {
    const token = this.authService.getToken();
    return this.http.get<any>(host + 'platforms', {
      params: {fromDate: formatDate(fromDate), toDate: formatDate(toDate)},
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

  getCampaignList(type: string, fromDate: string, toDate: string, page: number = 0, size: number = 10) {
    const token = this.authService.getToken();
    return this.http.get<any>(host + 'campaigns', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }, params: JSON.parse(JSON.stringify({type, fromDate, toDate, page, size}))
    });
  }

  getChartData(type: string, fromDate: string, toDate: string) {
    const token = this.authService.getToken();
    return this.http.get<any>(host + 'dashboard/chart', {
      params: {type, fromDate: formatDate(fromDate), toDate: formatDate(toDate)},
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

  getDownload(route: string, requests: string) {
    const token = this.authService.getToken();
    return this.http.get<any>(host + route + '/download', {
      responseType: 'blob' as 'json',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }, params: JSON.parse(requests)
    });
  }
}
