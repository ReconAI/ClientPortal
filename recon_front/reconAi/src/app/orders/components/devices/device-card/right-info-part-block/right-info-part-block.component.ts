import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'recon-right-info-part-block',
  templateUrl: './right-info-part-block.component.html',
  styleUrls: ['./right-info-part-block.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RightInfoPartBlockComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() category: string;
  @Input() manufacturer: string;
  @Input() salesPrice: string;

  constructor() {}

  ngOnInit(): void {}
}
