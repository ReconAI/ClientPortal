import { PreResetPasswordRequestInterface } from 'app/store/user/user.server.helpers';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'recon-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less'],
})
export class ForgotPasswordComponent implements OnInit {
  @Input() preResetError: string;
  @Output() sendEmail$ = new EventEmitter<PreResetPasswordRequestInterface>();

  emailForm = this.fb.group({
    email: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  sendClick(): void {
    this.sendEmail$.emit(this.emailForm.value);
  }
}
