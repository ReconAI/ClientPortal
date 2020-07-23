import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'recon-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
})
export class CardViewComponent implements OnInit {
  @Input() brand = '';
  @Input() expired = '';
  @Input() last4 = '';
  @Input() id = '';
  @Output() deleteCard$ = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  deleteCard(): void {
    this.deleteCard$.emit(this.id);
  }
}
