import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'recon-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  // TO DO
  // CHECK GUARD
  profileForm = this.fb.group({
    organization: this.fb.group({
      country: ['Belarus', Validators.required],
      city: ['Lida', Validators.required],
      company: ['HQSoftware', Validators.required],
      phone: ['+375292304825', Validators.required],
      contact: ['Alex', Validators.required],
      email: ['test@gmail.com', Validators.required],
      address: ['Varshavskaya street, 47', Validators.required],
      vat: ['7sadkd123adfsadsf2341', Validators.required],
    }),
    user: this.fb.group({
      company: ['hqsoftware', Validators.required],
      contact: ['Alex', Validators.required],
      phone: ['+3789451231', Validators.required],
      email: ['aadereiko@gmail.com', Validators.required],
    }),
    payment: this.fb.group({
      invoicingAddress: ['Varshavskaya street, 47', Validators.required],
      phone: ['+375515481254', Validators.required],
      contact: ['Andrei', Validators.required],
      email: ['mama@otlichinka.ru', Validators.required],
    })
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
