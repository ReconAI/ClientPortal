import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.less']
})
export class FormCheckboxComponent implements OnInit {
  @Input() label = '';
  @Input() checked = false;
  constructor() { }

  ngOnInit(): void {
  }

}
