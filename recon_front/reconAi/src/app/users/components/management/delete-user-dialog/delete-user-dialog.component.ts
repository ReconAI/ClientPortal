import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'recon-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.less'],
})
export class DeleteUserDialogComponent {
  @Input() name: string;
  @Input() isLoading: boolean;
  @Output() deleteClick$ = new EventEmitter();

  constructor() {}

  deleteClick(): void {
    this.deleteClick$.emit();
  }
}
