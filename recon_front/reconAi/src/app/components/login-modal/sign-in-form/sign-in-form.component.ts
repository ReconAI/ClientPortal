import { ForgotPasswordContainer } from './../forgot-password/forgot-password.container';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginUserFormInterface } from './../../../store/user/user.server.helpers';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormGroupName,
} from '@angular/forms';

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

  @Output() submitData$ = new EventEmitter<LoginUserFormInterface>(); // check type
  signInForm: FormGroup;
  dialogRef: MatDialogRef<any>; // check type
  readonly loginTooltipText = 'The Selected Login must be at least X symbols';
  readonly passwordTooltipText = `
  The selected password must be at least 8 characters and contain:
  • at least 2 lowercases (a-z);
  • at least 2 uppercases (A-Z);
  • at least 2 numbers (0-9);
  • at least 1 special character.`;

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

  openForgotPasswordDialog() {
    this.dialogRef = this.dialog.open(ForgotPasswordContainer, {
      width: '460px',
      height: '270px',
    });
  }

  get visibilityIcon() {
    return !this.hide ? 'visibility_off' : 'visibility';
  }

  onSubmit() {
    this.submitData$.emit(this.signInForm.value);
  }
}
