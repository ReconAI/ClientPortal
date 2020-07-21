import { Component, OnInit, Input } from '@angular/core';
import { ServerImageInterface } from 'app/orders/constants';

@Component({
  selector: 'recon-image-left-card-block',
  templateUrl: './image-left-card-block.component.html',
  styleUrls: ['./image-left-card-block.component.less'],
})
export class ImageLeftCardBlockComponent implements OnInit {
  @Input() images: ServerImageInterface[];
  activePictureIndex = 0;
  constructor() {}

  ngOnInit(): void {}

  get isBlockedFirst(): boolean {
    return !this.activePictureIndex;
  }

  get isBlockedLast(): boolean {
    return this?.images?.length - 1 === this.activePictureIndex;
  }

  changeActiveIndex(index: number) {
    if (index < this.images.length && index >= 0) {
      this.activePictureIndex = index;
    }
  }
}
