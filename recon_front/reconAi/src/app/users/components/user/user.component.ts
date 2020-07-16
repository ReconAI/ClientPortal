import { FormServerErrorInterface } from 'app/constants/types/requests';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  UserProfileFormInterface,
  UserRolesPriorities,
} from 'app/constants/types';

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
  @Input() rolePriority: UserRolesPriorities;
  @Output() sendUser$ = new EventEmitter<UserProfileFormInterface>();

  get hideInvoicing() {
    return this.rolePriority < UserRolesPriorities.ADMIN_ROLE;
  }
  sendUser(user: UserProfileFormInterface): void {
    this.sendUser$.emit(user);
  }
}
