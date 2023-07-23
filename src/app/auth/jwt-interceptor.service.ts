import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.userSubject.value;
    if (user && user.idToken.jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.idToken.jwtToken}`
        }
      });
    }

    return next.handle(request);
  }
}
