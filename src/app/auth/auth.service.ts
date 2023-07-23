import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LoginDto} from '../dtos/login.dto';
import {environment} from '../../environments/environment';
import {SignUpDto} from '../dtos/sign-up.dto';
import {catchError} from 'rxjs/operators';
import {RefreshTokenDto} from '../dtos/refresh-token.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthService {
  private jwtHelper = new JwtHelperService();

  public userSubject: BehaviorSubject<any>;
  public apiEndPoint = environment.apiEndPoint;
  userLocalStorageKey = 'USER_SESSION';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(this.userLocalStorageKey)));
    if (this.userSubject.value) {
      this.setAwsCredential();
    }
  }

  isTokenExpired = (token: string): boolean => this.jwtHelper.isTokenExpired(token);

  setAwsCredential(): void {
    const credentialLogins = {};
    credentialLogins[`${environment.cognitoLoginEndPoint}`] = this.userSubject.value.idToken.jwtToken;
    AWS.config.region = environment.awsRegion;
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.cognitoIdentityPoolId,
      Logins: credentialLogins,
    });
    credentials.get(() => {
      AWS.config.credentials = credentials;
    });
  }

  setLogin(cognitoUserSession: any): void {
    localStorage.setItem(this.userLocalStorageKey, JSON.stringify(cognitoUserSession));
    this.userSubject.next(cognitoUserSession);
    this.setAwsCredential();
  }

  login(loginDto: LoginDto): Promise<any> {
    return new Promise<any>(resolve => {
      this.httpClient.post<any>(`${this.apiEndPoint}/auth/login`, loginDto)
        .pipe(catchError(err => {
          if (err.error.message === 'User is not confirmed.') {
            const {name} = loginDto;
            this.router.navigate(['/verification', name]);
          }
          return throwError(err);
        }))
        .subscribe(cognitoUserSession => {
          this.setLogin(cognitoUserSession);
          this.router.navigate(['/']);
          resolve(cognitoUserSession);
        });
    });
  }

  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<any> {
    return new Promise<any>(resolve => {
      this.httpClient.post<any>(`${this.apiEndPoint}/auth/refresh-token`, refreshTokenDto)
        .pipe(catchError(err => {
          this.signOut();
          this.router.navigate(['/signin']);
          return throwError(err);
        }))
        .subscribe(cognitoUserSession => {
          this.setLogin(cognitoUserSession);
          resolve(cognitoUserSession);
        });
    });
  }

  signUp(signUpDto: SignUpDto): Promise<any> {
    return new Promise<any>(resolve => {
      this.httpClient.post<any>(`${this.apiEndPoint}/auth/sign-up`, signUpDto).subscribe(cognitoUser => {
        this.router.navigate(['/verification', cognitoUser.username]);
        resolve(cognitoUser);
      });
    });
  }

  confirmRegisterUser(username: string, code: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.httpClient.get<any>(`${this.apiEndPoint}/auth/verification-code?name=${username}&code=${code}`).subscribe(result => {
        this.router.navigate(['/signin']);
        resolve(result);
      });
    });
  }

  resendConfirmationCode(username: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.httpClient.get<any>(`${this.apiEndPoint}/auth/resend-code?name=${username}`).subscribe(result => {
        resolve(result);
      });
    });
  }

  signOut(): void {
    localStorage.removeItem(this.userLocalStorageKey);
    this.userSubject.next(null);
  }
}
