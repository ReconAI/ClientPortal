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
  @Input() disabledUserEmail = false;
  @Input() disabledOrganization = false;
  @Input() disabledInvoicing = false;

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
        { value: this.userEmail || '', disabled: this.disabledUserEmail },
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
                {
                  value: this.organizationFirstName || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
              lastName: [
                {
                  value: this.organizationLastName || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
              name: [
                {
                  value: this.organizationName || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
              phone: [
                {
                  value: this.organizationPhone || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
              email: [
                {
                  value: this.organizationEmail || '',
                  disabled: this.disabledOrganization,
                },
                this.disabledInvoicing ? Validators.required : null,
              ],
              address: [
                {
                  value: this.organizationAddress || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
              vat: [
                {
                  value: this.organizationVat || '',
                  disabled: this.disabledOrganization,
                },
                Validators.required,
              ],
            }),
            invoicing: this.fb.group({
              firstName: [
                {
                  value: this.invoicingFirstName || '',
                  disabled: this.disabledInvoicing,
                },
                Validators.required,
              ],
              lastName: [
                {
                  value: this.invoicingLastName || '',
                  disabled: this.disabledInvoicing,
                },
                Validators.required,
              ],
              address: [
                {
                  value: this.invoicingAddress || '',
                  disabled: this.disabledInvoicing,
                },
                Validators.required,
              ],
              phone: [
                {
                  value: this.invoicingPhone || '',
                  disabled: this.disabledInvoicing,
                },
                Validators.required,
              ],
              email: [
                {
                  value: this.invoicingEmail || '',
                  disabled: this.disabledInvoicing,
                },
                Validators.required,
              ],
            }),
          }
    );
  }

  get validationStatus(): boolean {
    // check whether there's some block and its validation if it's needed
    // and email requirement is optional depending on disabledEmail flag
    const isOrganizationValid =
      this.isInvitation ||
      this.disabledOrganization ||
      this.profileForm.controls.organization.valid;
    const isInvoicingValid =
      this.isInvitation ||
      this.disabledInvoicing ||
      this.profileForm.controls.invoicing.valid;
    const isUserValid = this.profileForm.controls.user.valid;

    const isProfileValid =
      !this.isInvitation || this.profileForm.controls.profile.valid;
    return (
      isUserValid && isInvoicingValid && isOrganizationValid && isProfileValid
    );
  }

  ngOnInit(): void {
    this.profileForm = this.createGroup();
  }

  onSubmit(): void {
    this.sendUserInfo$.emit(this.profileForm.value);
  }
}
