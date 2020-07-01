export interface FormServerErrorInterface {
  [key: string]: string;
}

export interface ObjectFormErrorInterface {
  errors: FormServerErrorInterface;
}
