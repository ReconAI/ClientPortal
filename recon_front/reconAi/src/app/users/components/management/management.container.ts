import { UserInterface } from './../../constants/types/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-management-container',
  templateUrl: './management.container.html',
})
export class ManagementContainer implements OnInit {
  constructor() {}
  users: UserInterface[];

  ngOnInit(): void {
    this.users = Array(15)
      .fill(0)
      .map((_, index) => ({
        firstName: (index + 1).toString(),
        lastName: 'Jonas',
        phone: '7896554123',
        email: 'someEmail@email.ru',
        role: 'Client',
        isActive: !!(index % 2),
      }));
  }
}
