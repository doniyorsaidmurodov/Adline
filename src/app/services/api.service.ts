import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {host} from '../../environments/consts';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  // user
  login(username: string, password: string) {
    return this.http.post<any>(host + 'authenticate', {username, password, rememberMe: false});
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
  getAdGroupList(type: string, startDate: string, endDate: string, campaignId: number = null) {
    const token = this.authService.getToken();
    let body = null;
    if (campaignId) {
      body = {type, startDate, endDate, campaignId};
    } else {
      body = {type, startDate, endDate};
    }
    return this.http.post<any>(host + 'ad-groups', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

  getAdList(type: string, startDate: string, endDate: string, adGroupId: number = null) {
    const token = this.authService.getToken();
    let body = null;
    if (adGroupId) {
      body = {type, startDate, endDate, adGroupId};
    } else {
      body = {type, startDate, endDate};
    }
    return this.http.post<any>(host + 'ads', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
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

  getCampaignList(type: string, startDate: string, endDate: string) {
    const token = this.authService.getToken();
    return this.http.post<any>(host + 'campaigns', {type, startDate, endDate}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
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
}

function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}
