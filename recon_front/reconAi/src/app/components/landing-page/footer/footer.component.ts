import { TermsDialogComponent } from './../../../shared/terms-dialog/terms-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }

  openTerms(): void {
    this.dialog.open(TermsDialogComponent, {
      width: '600px',
    });
  }

  ngOnInit(): void {}
}
