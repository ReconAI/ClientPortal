import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NewRequestFeatureClientInterface } from 'app/store/user/user.server.helpers';

@Component({
  selector: 'recon-new-feature',
  templateUrl: './new-feature.component.html',
  styleUrls: ['./new-feature.component.less'],
})
export class NewFeatureComponent implements OnInit {
  @Input() validationError = '';
  @Input() loadingStatus = false;

  @Output() postRequest$ = new EventEmitter<NewRequestFeatureClientInterface>();
  constructor(private fb: FormBuilder) {}
  newFeatureForm: FormGroup;

  get jsonValue(): string {
    return JSON.stringify(this.newFeatureForm.value);
  }

  get feedLinks() {
    return this?.newFeatureForm?.get('feedLinks') as FormArray;
  }

  ngOnInit(): void {
    this.newFeatureForm = this.fb.group({
      description: [null, Validators.required],
      feedLinks: this.fb.array([this.fb.control('')]),
      files: this.fb.array([]),
    });
  }

  addLink(): void {
    this.feedLinks.push(this.fb.control(''));
  }

  removeLink(i: number): void {
    this.feedLinks.removeAt(i);
  }

  postRequest(): void {
    this.postRequest$.emit({
      newRequestFeature: this.newFeatureForm.value,
    });
  }
}
