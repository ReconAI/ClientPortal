import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ServerImageInterface } from 'app/orders/constants';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'recon-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.less'],
})
export class DeviceCardComponent implements OnInit, OnDestroy {
  @Input() name: string;
  @Input() product: string;
  @Input() description: string;
  @Input() manufacturer: string;
  @Input() category: string;
  @Input() salesPrice: string;
  @Input() salesPriceWithVat: string;
  @Input() seoTags: string;
  @Input() seoTitle: string;
  @Input() seoDescription: string;
  @Input() images: ServerImageInterface[];
  @Input() isAbleToBuy: boolean;
  @Output() addToBasket$ = new EventEmitter<number>();

  constructor(private meta: Meta) {}

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: this?.seoDescription,
    });

    this.meta.updateTag({
      name: 'keywords',
      content: this?.seoTags,
    });
    this.meta.updateTag({
      name: 'title',
      content: this.seoTitle,
    });
  }

  ngOnDestroy(): void {
    this.meta.removeTag('name=description');
    this.meta.removeTag('name=keywords');
    this.meta.removeTag('name=title');
  }

  addToBasket(amount: number): void {
    this.addToBasket$.emit(amount);
  }
}
