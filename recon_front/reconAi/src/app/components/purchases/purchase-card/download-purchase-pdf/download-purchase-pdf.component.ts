import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'recon-download-purchase-pdf',
  templateUrl: './download-purchase-pdf.component.html',
  styleUrls: ['./download-purchase-pdf.component.less'],
})
export class DownloadPurchasePdfComponent implements OnInit {
  @Input() loading = false;
  @Output() downloadClick$ = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  onDownloadClick(): void {
    this.downloadClick$.emit();
  }
}
