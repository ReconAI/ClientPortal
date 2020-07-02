import { UserInterface } from './../../constants/types/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  @Input() data: UserInterface[] = [
    {
      firstName: 'Nick',
      lastName: 'Jonas',
      phone: '7896554123',
      email: 'someEmail@email.ru',
      role: 'Client',
      isActive: true,
    },
    {
      firstName: 'Nick',
      lastName: 'Jonas',
      phone: '7896554123',
      email: 'someEmail@email.ru',
      role: 'Client',
      isActive: true,
    },
    {
      firstName: 'Nick',
      lastName: 'Jonas',
      phone: '7896554123',
      email: 'someEmail@email.ru',
      role: 'Client',
      isActive: true,
    },
    {
      firstName: 'Nick',
      lastName: 'Jonas',
      phone: '7896554123',
      email: 'someEmail@email.ru',
      role: 'Client',
      isActive: true,
    },
  ];

  readonly columns: string[] = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'role',
    'isActive',
  ];
  constructor() {}

  ngOnInit(): void {}
}
