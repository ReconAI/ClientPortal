import { TemplateRef } from '@angular/core';

export interface CrudTableColumn {
  header: string;
  id: string;
  render?: (elem: any) => string;
  width?: string;
  cellTemplate?: TemplateRef<any>;
}
