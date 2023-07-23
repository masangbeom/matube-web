import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AppService} from './app.service';
import {Router} from '@angular/router';
import {AuthService} from './auth/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private nzMessageService: NzMessageService,
    private authService: AuthService,
    private appService: AppService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request: HttpRequest<any> = req.clone();
    return next.handle(request).pipe(catchError(e => {
      if (e.status === 401) {
        this.authService.signOut();
        this.router.navigate(['/signin']);
      }
      if (e.error && e.error.message) {
        this.nzMessageService.error(e.error.message, {nzDuration: 5000});
        this.appService.loadingBehavior.next(false);
      }
      return throwError(e);
    }));
  }
}
