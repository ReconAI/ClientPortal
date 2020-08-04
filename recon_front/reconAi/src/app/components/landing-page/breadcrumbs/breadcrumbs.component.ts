import { Component, OnInit, Input } from '@angular/core';
import { BreadcrumbInterface } from 'app/constants/routes';

@Component({
  selector: 'recon-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.less'],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs: BreadcrumbInterface[] = [];
  @Input() visibility = false;
  constructor() {}

  ngOnInit(): void {}
}
