import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-new-feature',
  templateUrl: './new-feature.component.html',
  styleUrls: ['./new-feature.component.less'],
})
export class NewFeatureComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  readonly maxCountOfFiles = 20;
  newFeatureForm: FormGroup;

  get jsonValue(): string {
    return JSON.stringify(this.newFeatureForm.value);
  }

  get files() {
    return this?.newFeatureForm?.get('files') as FormArray;
  }

  onFilesChange(event): void {
    const newFiles = event?.target?.files;
    if (newFiles?.length) {
      for (
        let i = 0;
        i < Math.min(this.maxCountOfFiles, newFiles.length);
        i++
      ) {
        this.files.push(this.fb.control(newFiles[i]));
      }
    }
  }

  ngOnInit(): void {
    this.newFeatureForm = this.fb.group({
      description: [null, Validators.required],
      feedLink: [null],
      files: this.fb.array([]),
    });
  }

  removeFile(i: number) {
    this.files.removeAt(i);
  }
}
