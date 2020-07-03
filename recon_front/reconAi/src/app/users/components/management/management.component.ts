import { UserInterface } from './../../constants/types/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  @Input() data: UserInterface[] = [];

  readonly columns = [
    {
      header: 'First name',
      id: 'firstName',
    },
    {
      header: 'Last name',
      id: 'lastName',
    },
    {
      header: 'Phone',
      id: 'phone',
      width: '12%',
    },
    {
      header: 'Email',
      id: 'email',
    },
    {
      header: 'Role',
      id: 'role',
      width: '7%',
    },
    {
      header: 'Active/Inactive',
      id: 'isActive',
      width: '8%',

      render: (elem): string => (elem.isActive ? 'Active' : 'Not active'),
    },
  ];

  ngOnInit(): void {}
}
