import { PASSWORD_RULES_TOOLTIP } from './../../../constants/labels/password';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ResetPasswordInterface } from 'app/constants/types/resetPassword';

@Component({
  selector: 'recon-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.less'],
})
export class ResetPasswordModalComponent implements OnInit {
  passwordForm: FormGroup;
  @Input() loadingStatus = false;
  @Input() validationError: string;
  @Output() sendPasswords$ = new EventEmitter<ResetPasswordInterface>();

  readonly passwordTooltipText = PASSWORD_RULES_TOOLTIP;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password1: [null, Validators.required],
      password2: [null, Validators.required],
    });
  }

  onSubmit(): void {
    this.sendPasswords$.emit(this.passwordForm.value);
  }
}
