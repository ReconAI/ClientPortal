import { Validators, FormBuilder } from '@angular/forms';
import { PreResetPasswordRequestInterface } from './../../../store/user/user.server.helpers';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'recon-pre-reset-password',
  templateUrl: './pre-reset-password.component.html',
  styleUrls: ['./pre-reset-password.component.less'],
})
export class PreResetPasswordComponent implements OnInit {
  @Input() preResetError: string;
  @Input() loading = false;
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
