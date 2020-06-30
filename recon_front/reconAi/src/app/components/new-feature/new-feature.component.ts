import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-new-feature',
  templateUrl: './new-feature.component.html',
  styleUrls: ['./new-feature.component.less'],
})
export class NewFeatureComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  newFeatureForm: FormGroup;
  fileNames: string[];

  get jsonValue(): string {
    return JSON.stringify(this.newFeatureForm.value);
  }

  get fileNamesToShow(): string {
    console.log(this?.fileNames?.length, 'FILE NAMES');
    return 'this?.fileNames?.join(\' \')';
  }

  onFilesChange(event): void {
    this.fileNames = event?.target?.files || [];
    console.log(event?.target?.files, 'FILES CHANGES');
  }

  ngOnInit(): void {
    this.newFeatureForm = this.fb.group({
      description: [null, Validators.required],
      feedLink: [null, Validators.required],
      filesToUpload: ['', Validators.required],
    });
  }
}
