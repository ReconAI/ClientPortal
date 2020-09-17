import { Component, OnInit, Input } from '@angular/core';
import { ServerImageInterface } from 'app/orders/constants';

@Component({
  selector: 'recon-image-left-card-block',
  templateUrl: './image-left-card-block.component.html',
  styleUrls: ['./image-left-card-block.component.less'],
})
export class ImageLeftCardBlockComponent implements OnInit {
  @Input() images: ServerImageInterface[];
  readonly shownCount = 5;
  readonly centerIndex = Math.trunc(this.shownCount / 2);

  activePictureIndex = 0;
  shownIndexes = [];
  constructor() {}

  ngOnInit(): void {
    this.shownIndexes = this.range(this.amountOfShownPictures);
  }

  get isBlockedFirst(): boolean {
    return !this.activePictureIndex;
  }

  get isBlockedLast(): boolean {
    return this?.images?.length - 1 === this.activePictureIndex;
  }

  changeActiveIndex(index: number): void {
    if (index < this?.images?.length && index >= 0) {
      this.activePictureIndex = index;
      this.handleShownIndexes();
    }
  }

  get amountOfShownPictures(): number {
    return Math.min(this?.images?.length, this?.shownCount);
  }

  handleShownIndexes(): void {
    if (this.activePictureIndex <= this.centerIndex) {
      this.shownIndexes = this.range(this.amountOfShownPictures);
    } else if (
      this.activePictureIndex <
      this?.images?.length - 1 - this.centerIndex
    ) {
      this.shownIndexes = this.range(
        this.amountOfShownPictures,
        this.activePictureIndex - this.centerIndex
      );
    } else {
      this.shownIndexes = this.range(
        this.amountOfShownPictures,
        this?.images?.length - this.amountOfShownPictures
      );
    }
  }

  range(size: number, startAt: number = 0): number[] {
    return [...Array(size).keys()].map((i) => i + startAt);
  }
}
