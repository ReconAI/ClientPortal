import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'recon-form-file-with-list',
  templateUrl: './form-file-with-list.component.html',
  styleUrls: ['./form-file-with-list.component.less'],
})
export class FormFileWithListComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() field: string;
  @Input() accept: string;
  @Input() label = '';
  @Input() hint = '';
  @Input() maxSumSize = 0; // Bytes
  @Input() maxCountOfFiles = 20;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  get files() {
    return this.parentForm.get(this.field) as FormArray;
  }

  removeFile(i: number) {
    this.files.removeAt(i);
  }

  onFilesChange(event): void {
    if (
      (event?.target?.files?.length || 0) + (this.files?.value?.length || 0) >
      this.maxCountOfFiles
    ) {
      this.openSnackBar(
        `Only ${this.maxCountOfFiles} files are available to download.`
      );
    }

    const newFilesWithCount: File[] =
      [...(this.files?.value || []), ...event?.target?.files].slice(
        0,
        this.maxCountOfFiles
      ) || [];

    const newFilesWithWeight = [];
    let currentSum = 0;
    newFilesWithCount.reverse().forEach((file) => {
      currentSum += file.size;
      if (!this.maxSumSize || currentSum <= this.maxSumSize) {
        newFilesWithWeight.push(file);
      } else {
        this.openSnackBar(
          `You've exceeded the max weight of files. It is ${
            this.maxSumSize / 1024 / 1024
          } Mb.`
        );
        currentSum -= file.size;
      }
    });

    this.files.clear();

    if (newFilesWithWeight?.length) {
      newFilesWithWeight.reverse();
      for (let i = 0; i < newFilesWithWeight.length; i++) {
        this.files.push(this.fb.control(newFilesWithWeight[i]));
      }
    }
  }

  openSnackBar(text = '') {
    this.snackBar.open(text, null, {
      duration: 3 * 1000,
      panelClass: ['recon-snackbar'],
    });
  }

  openFileInTab(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
