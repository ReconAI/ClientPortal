import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
  ngOnInit(): void {}
}
