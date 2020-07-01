import { UserRolesPriorities } from './../../../constants/types/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  readonly userRolePriorities = UserRolesPriorities;
  constructor() { }

  ngOnInit(): void {
  }

}
