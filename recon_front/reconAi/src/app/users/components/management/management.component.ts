import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserInterface } from './../../constants/types/user';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DeleteUserDialogContainer } from './delete-user-dialog/delete-user-dialog.container';
import { AddUserDialogContainer } from './add-user-dialog/add-user-dialog.container';

@Component({
  selector: 'recon-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  @Input() data: UserInterface[] = [];
  @Input() totalCount: number;
  @Input() currentPage: number;
  @Input() pageSize: number;

  @Output() loadData$ = new EventEmitter<number>();

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
      header: 'Date of creation',
      id: 'createdDT',
      width: '10%',
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

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {}

  userClick(user: UserInterface): void {
    this.router.navigate([`/users/${user?.id}`]);
  }

  editUserClick(user: UserInterface): void {}

  deleteUserClick(user: UserInterface): void {
    this.openDeleteDialog(user);
  }

  openAddDialog(): void {
    this.dialog.open(AddUserDialogContainer, {
      width: '440px',
      height: '450px',
    });
  }

  openDeleteDialog(user: UserInterface): void {
    this.dialog.open(DeleteUserDialogContainer, {
      width: '440px',
      height: '200px',
      data: {
        name: `${user.firstName} ${user.lastName}`,
        id: user.id,
      },
    });
  }

  loadData(page: number): void {
    this.loadData$.emit(page);
  }
}
