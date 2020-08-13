export interface BreadcrumbInterface {
  label: string;
  url: string;
  id?: string;
  queryParams?: {
    [key: string]: string;
  };
}
