import {
  UserProfileFormInterface,
  UserRolesPriorities,
} from './../../constants/types/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-current-user-profile',
  templateUrl: './current-user-profile.component.html',
  styleUrls: ['./current-user-profile.component.less'],
})
export class CurrentUserProfileComponent implements OnInit {
  constructor() {}
  readonly userRolePriorities = UserRolesPriorities;

  @Input() isLoading = false;
  @Input() isChangingPassword = false;

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
  @Output() changePasswordClick$ = new EventEmitter<void>();

  ngOnInit(): void {}

  // disable organization and invoicing blocks for clients
  get isClient(): boolean {
    return this.userRolePriority < UserRolesPriorities.DEVELOPER_ROLE;
  }

  get isDeveloperAtLeast(): boolean {
    return this.userRolePriority >= UserRolesPriorities.DEVELOPER_ROLE;
  }

  onChangePassword(): void {
    this.changePasswordClick$.emit();
  }

  updateUser(user: UserProfileFormInterface): void {
    this.updateUser$.emit(user);
  }
}
