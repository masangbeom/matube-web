import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MainComponent} from './main/main.component';
import {ko_KR, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import ko from '@angular/common/locales/ko';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {VideoPlayerComponent} from './components/video-player/video-player.component';
import {AppService} from './app.service';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NgxLoadingModule} from 'ngx-loading';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {AuthService} from './auth/auth.service';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/signup/sign-up.component';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {JwtInterceptor} from './auth/jwt-interceptor.service';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {HttpInterceptorService} from './http.interceptor.service';
import {VerificationCodeComponent} from './auth/verification-code/verification-code.component';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'signin',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignUpComponent,
      },
      {
        path: 'verification',
        component: VerificationCodeComponent,
      },
      {
        path: 'verification/:username',
        component: VerificationCodeComponent,
      }
    ]
  },
];

@NgModule({
  declarations: [
    MainComponent,
    VideoPlayerComponent,

    LoginComponent,
    SignUpComponent,
    AppComponent,
    VerificationCodeComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({fullScreenBackdrop: true}),
    FilterPipeModule,

    NzCheckboxModule,
    NzGridModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzButtonModule,
    NzUploadModule,
    NzMessageModule,
    NzStepsModule,
    NzSpinModule,
    NzTagModule,
    NzRadioModule,
    NzFormModule,
    NzPopconfirmModule,
    NzNotificationModule,
  ],
  providers: [
    {provide: NZ_I18N, useValue: ko_KR},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    AppService,
    AuthService,
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
