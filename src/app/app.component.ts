import { Component, OnInit } from '@angular/core';
import {AppService} from './app.service';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = false;
  isCheckToken = false;
  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) {
    this.appService.loadingBehavior.subscribe(isLoading => this.isLoading = isLoading);
    if (!this.isCheckToken && this.authService.userSubject.value) {
      this.isCheckToken = true;
      const userSession = this.authService.userSubject.value;
      if (this.authService.isTokenExpired(userSession.idToken.jwtToken)) {
        this.authService.refreshToken({
          name: userSession.idToken.payload['cognito:username'],
          refresh_token: userSession.refreshToken.token,
        }).then();
      }
    }
  }

  ngOnInit(): void {
  }

}
