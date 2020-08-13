export interface CrudTableColumn {
  header: string;
  id: string;
  render?: (elem: any) => string;
  width?: string;
}
