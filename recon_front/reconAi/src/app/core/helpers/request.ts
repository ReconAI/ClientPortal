import {
  PaginationResponseServerInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
// it checks the length of data before removing and calculates new page
// it's the same if there's data and current page - 1 if there's no data
export const calculatePageAfterDelete = (
  currentPage: number,
  length: number
): number => {
  if (length > 1) {
    return currentPage;
  }

  return currentPage > 1 ? currentPage - 1 : 1;
};

export const generalTransformPaginationFromServer = (
  data: PaginationResponseServerInterface<any>
): PaginationResponseClientInterface<any> => ({
  list: data.results,
  meta: {
    currentPage: data.current,
    count: data.count,
    pageSize: data.page_size,
  },
});
