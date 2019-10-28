import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ResetComponent implements OnInit {
  email = '';
  error: string = null;

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
  }

  send(): void {
    this.apiService.requestPasswordReset(this.email).subscribe(next => {
      console.log(next);
      this.router.navigate(['/auth/reset/finish']).then();
    }, error => {
      this.error = error.error.message;
      console.error(error);
    });
  }

}
