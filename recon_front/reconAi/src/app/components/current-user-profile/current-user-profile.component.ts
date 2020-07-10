import { UserProfileFormInterface } from './../../constants/types/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserRolesPriorities } from 'app/constants/types';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-current-user-profile',
  templateUrl: './current-user-profile.component.html',
  styleUrls: ['./current-user-profile.component.less'],
})
export class CurrentUserProfileComponent implements OnInit {
  constructor() {}
  @Input() isLoading = false;
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

  @Input() userRolePriority: UserRolesPriorities;
  @Input() errors: FormServerErrorInterface;
  @Input() sendLoadingStatus = false;

  @Output() updateUser$ = new EventEmitter<UserProfileFormInterface>();
  ngOnInit(): void {}

  // disable organization and invoicing blocks for clients
  disablingBlocks(): boolean {
    return this.userRolePriority < UserRolesPriorities.ADMIN_ROLE;
  }

  updateUser(user: UserProfileFormInterface): void {
    this.updateUser$.emit(user);
  }
}
