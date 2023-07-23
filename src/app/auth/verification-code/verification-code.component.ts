import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AppService} from '../../app.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-verfication-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [this.route.snapshot.params.username, [Validators.required]],
      code: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.appService.loadingBehavior.next(true);
      const {name, code} = this.validateForm.getRawValue();
      this.authService.confirmRegisterUser(name, code).then(() => this.appService.loadingBehavior.next(false));
    }
  }

  resendVerification(): void {
    const username = this.validateForm.get('name').value;
    this.appService.loadingBehavior.next(true);
    this.authService.resendConfirmationCode(username).then(() => this.appService.loadingBehavior.next(false));
  }
}
