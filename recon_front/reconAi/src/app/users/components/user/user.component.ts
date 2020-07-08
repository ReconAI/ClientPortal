import { FormServerErrorInterface } from 'app/constants/types/requests';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent implements OnInit {
  constructor() {}

  @Input() isLoading = true;
  @Input() errors: FormServerErrorInterface;
  @Input() isUserFound: boolean;
  @Input() organizationName: string;
  @Input() organizationPhone: string;
  @Input() organizationEmail: string;
  @Input() organizationAddress: string;
  @Input() organizationVat: string;
  @Input() organizationFirstName: string;
  @Input() organizationLastName: string;

  @Input() userPhone: string;
  @Input() userEmail: string;
  @Input() userAddress: string;
  @Input() userFirstName: string;
  @Input() userLastName: string;

  @Input() invoicingPhone: string;
  @Input() invoicingEmail: string;
  @Input() invoicingAddress: string;
  @Input() invoicingFirstName: string;
  @Input() invoicingLastName: string;

  ngOnInit(): void {}
}