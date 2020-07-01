import { Validators, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserProfileFormInterface } from 'app/constants/types';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  @Input() loading = false;
  @Input() errors: FormServerErrorInterface;
  @Output() sendUserInfo$ = new EventEmitter<UserProfileFormInterface>();

  // TO DO
  // CHECK GUARD
  profileForm = this.fb.group({
    organization: this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      vat: ['', Validators.required],
    }),
    user: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    }),
    invoicing: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    }),
  });

  get validationErrors(): string {
    return (
      (this.errors &&
        Object.keys(this.errors)?.reduce(
          (final, key) => `${final}\n${key}: ${this.errors[key]}`,
          ''
        )) ||
      ''
    );
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.sendUserInfo$.emit(this.profileForm.value);
  }
}
