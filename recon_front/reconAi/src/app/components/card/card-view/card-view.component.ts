import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
})
export class CardViewComponent implements OnInit {
  @Input() brand: string = 'VISA';
  constructor() {}

  ngOnInit(): void {}
}
