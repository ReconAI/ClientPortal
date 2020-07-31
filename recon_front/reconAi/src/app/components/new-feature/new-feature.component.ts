import { newRequestFeatureSucceededAction } from './../../store/user/user.actions';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Action } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { NewRequestFeatureClientInterface } from 'app/store/user/user.server.helpers';

@Component({
  selector: 'recon-new-feature',
  templateUrl: './new-feature.component.html',
  styleUrls: ['./new-feature.component.less'],
})
export class NewFeatureComponent implements OnInit {
  @Input() validationError = '';
  @Input() loadingStatus = false;
  readonly maxFileSize = 1024 * 1024 * 100;

  @Output() postRequest$ = new EventEmitter<NewRequestFeatureClientInterface>();
  constructor(private fb: FormBuilder) {}
  newFeatureForm: FormGroup;
  closeModalSubscription$: Subscription;

  get feedLinks() {
    return this?.newFeatureForm?.get('feedLinks') as FormArray;
  }

  ngOnInit(): void {
    this.newFeatureForm = this.fb.group({
      description: ['', Validators.required],
      feedLinks: this.fb.array([]),
      files: this.fb.array([]),
    });
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  addLink(): void {
    this.feedLinks.push(this.fb.control('', Validators.required));
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
