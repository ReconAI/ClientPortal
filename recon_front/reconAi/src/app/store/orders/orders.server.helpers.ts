import { CategoryInterface } from './../../orders/constants/types/category';

export interface CategoriesServerResponseInterface {
  results: CategoryInterface[];
}

export interface CategoriesClientInterface {
  categories: CategoryInterface[];
}

export const transformCategoriesFromServer = (
  response: CategoryInterface[]
): CategoriesClientInterface => ({
  categories: response,
});

export interface CategoriesFormInterface {
  categories: string[];
}
