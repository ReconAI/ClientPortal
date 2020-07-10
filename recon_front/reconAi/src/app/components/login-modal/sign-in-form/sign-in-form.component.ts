import { MatInput } from '@angular/material/input';
import { LOGIN_RULES_TOOLTIP } from './../../../constants/labels/login';
import { PASSWORD_RULES_TOOLTIP } from './../../../constants/labels/password';
import { Observable, Subscription } from 'rxjs';
import { PreResetPasswordContainer } from './../pre-reset-password/pre-reset-password.container';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginUserFormInterface } from './../../../store/user/user.server.helpers';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'recon-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.less'],
})
export class SignInFormComponent implements OnInit, OnDestroy {
  // rename
  @Input() loadingStatus = false;
  @Input() isSignUp: boolean;
  @Input() validationError: string;
  @Output() submitData$ = new EventEmitter<LoginUserFormInterface>();
  signInForm: FormGroup;
  dialogRef: MatDialogRef<PreResetPasswordContainer>;

  readonly loginTooltipText = LOGIN_RULES_TOOLTIP;
  readonly passwordTooltipText = PASSWORD_RULES_TOOLTIP;

  hide = true;
  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.signInForm = this.buildFormGroup();
  }

  ngOnDestroy(): void {}

  buildFormGroup(): FormGroup {
    return this.fb.group({
      login: [null, Validators.required],
      password1: [null, Validators.required],
      ...(this.isSignUp ? { password2: [null, Validators.required] } : {}),
    });
  }

  openForgotPasswordDialog(): void {
    this.dialogRef = this.dialog.open(PreResetPasswordContainer, {
      width: '460px',
      height: '270px',
    });
  }

  onSubmit() {
    this.submitData$.emit(this.signInForm.value);
  }
}
