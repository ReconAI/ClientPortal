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
    const newFiles = [
      ...event?.target?.files,
      ...(this.files?.value || []),
    ].slice(0, this.maxCountOfFiles);
    this.files.clear();

    if (newFiles?.length) {
      for (let i = 0; i < newFiles.length; i++) {
        this.files.push(this.fb.control(newFiles[i]));
      }
    }
  }
}
