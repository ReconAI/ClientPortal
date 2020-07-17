export interface FormServerErrorInterface {
  [key: string]: string;
}

export interface ObjectFormErrorInterface {
  errors: FormServerErrorInterface;
}

export interface UrlInterceptorInterface {
  url: string;
  method?: string;
}

export interface PaginationRequestInterface {
  page: number;
}
