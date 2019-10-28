import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['../auth.component.scss']
})
export class FinishComponent implements OnInit {
  code = '';
  newPassword = '';
  error: string = null;

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
  }

  send(): void {
    this.apiService.finishPasswordReset(this.code, this.newPassword).subscribe(next => {
      console.log(next);
      this.router.navigate(['/auth']).then();
    }, error => {
      error = error.error.message;
      console.error(error);
    });
  }

}
