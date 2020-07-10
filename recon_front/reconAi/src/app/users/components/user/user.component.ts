import { FormServerErrorInterface } from 'app/constants/types/requests';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserProfileFormInterface } from 'app/constants/types';

@Component({
  selector: 'recon-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent {
  constructor() {}

  @Input() isLoading = true;
  @Input() errors: FormServerErrorInterface;
  @Input() isUserFound: boolean;
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

  @Input() isUpdating: boolean;

  @Output() sendUser$ = new EventEmitter<UserProfileFormInterface>();

  sendUser(user: UserProfileFormInterface): void {
    this.sendUser$.emit(user);
  }
}
