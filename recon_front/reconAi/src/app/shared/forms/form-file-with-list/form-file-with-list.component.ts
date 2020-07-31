import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get files() {
    return this.parentForm.get(this.field) as FormArray;
  }

  removeFile(i: number) {
    this.files.removeAt(i);
  }

  onFilesChange(event): void {
    const newFilesWithCount: File[] =
      [...event?.target?.files, ...(this.files?.value || [])].slice(
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

  openFileInTab(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
