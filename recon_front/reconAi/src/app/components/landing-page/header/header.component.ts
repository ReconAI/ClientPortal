import { Router } from '@angular/router';
import { UserRolesPriorities } from './../../../constants/types/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  readonly userRolePriorities = UserRolesPriorities;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
