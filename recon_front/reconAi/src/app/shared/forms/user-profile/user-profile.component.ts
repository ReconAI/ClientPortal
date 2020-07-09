import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { UserProfileFormInterface } from 'app/constants/types';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
})
export class UserProfileComponent implements OnInit {
  @Input() loading = false;
  @Input() errors: FormServerErrorInterface;
  @Input() showTerms = false;
  @Input() isInvitation = false;
  // make it work
  @Input() disabledButton = false;

  @Input() organizationName: string;
  @Input() organizationPhone: string;
  @Input() organizationEmail: string;
  @Input() organizationAddress: string;
  @Input() organizationVat: string;
  @Input() organizationFirstName: string;
  @Input() organizationLastName: string;

  @Input() userPhone: string;
  @Input() userEmail: string;
  @Input() userAddress: string;
  @Input() userFirstName: string;
  @Input() userLastName: string;

  @Input() invoicingPhone: string;
  @Input() invoicingEmail: string;
  @Input() invoicingAddress: string;
  @Input() invoicingFirstName: string;
  @Input() invoicingLastName: string;

  // it's used for invitation
  @Input() profileUsername: string;

  @Output() sendUserInfo$ = new EventEmitter<UserProfileFormInterface>();

  profileForm: FormGroup;
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

  // ngOnChanges(changes: SimpleChanges) {
  //   // checks whether form is changed from outside
  //   // for (const propName in changes) {
  //   //   if (changes.hasOwnProperty(propName)) {
  //   //     let block = '';
  //   //     if (propName.startsWith('organization')) {
  //   //       console.log(propName, 'RPOP NAME');
  //   //       block = 'organization';
  //   //     }
  //   //     if (propName.startsWith('user')) {
  //   //       block = 'user';
  //   //     }
  //   //     if (propName.startsWith('invoicing')) {
  //   //       block = 'invoicing';
  //   //     }
  //   //     if (block) {
  //   //       let field = propName.slice(block.length);
  //   //       field = field.charAt(0).toLowerCase() + field.slice(1);
  //   //       this?.profileForm
  //   //         ?.get([block, field])
  //   //         .patchValue(changes[propName].currentValue);
  //   //     }
  //   //   }
  //   // }
  // }

  createGroup(): FormGroup {
    const userGroup = this.fb.group({
      firstName: [this.userFirstName || '', Validators.required],
      lastName: [this.userLastName || '', Validators.required],
      address: [this.userAddress || '', Validators.required],
      phone: [this.userPhone || '', Validators.required],
      email: [
        { value: this.userEmail || '', disabled: this.isInvitation },
        Validators.required,
      ],
    });

    return this.fb.group(
      this.isInvitation
        ? {
            user: userGroup,
            profile: this.fb.group({
              username: [this.profileUsername || '', Validators.required],
              password1: ['', Validators.required],
              password2: ['', Validators.required],
            }),
          }
        : {
            user: userGroup,
            organization: this.fb.group({
              firstName: [
                this.organizationFirstName || '',
                Validators.required,
              ],
              lastName: [this.organizationLastName || '', Validators.required],
              name: [this.organizationName || '', Validators.required],
              phone: [this.organizationPhone || '', Validators.required],
              email: [this.organizationEmail || '', Validators.required],
              address: [this.organizationAddress || '', Validators.required],
              vat: [this.organizationVat || '', Validators.required],
            }),
            invoicing: this.fb.group({
              firstName: [this.invoicingFirstName || '', Validators.required],
              lastName: [this.invoicingLastName || '', Validators.required],
              address: [this.invoicingAddress || '', Validators.required],
              phone: [this.invoicingPhone || '', Validators.required],
              email: [this.invoicingEmail || '', Validators.required],
            }),
          }
    );
  }

  ngOnInit(): void {
    this.profileForm = this.createGroup();
  }

  onSubmit(): void {
    this.sendUserInfo$.emit(this.profileForm.value);
  }
}
