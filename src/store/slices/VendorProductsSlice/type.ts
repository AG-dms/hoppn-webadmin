import {
  PromiseProductCategory,
  PromiseSingleEditProduct,
  SingleProduct,
} from '@/api/dto/VendorResponseData';
import currency from 'currency.js';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type VendorProductsInitialState = {
  vendorProductsList: SingleProduct[];
  count: number;
  filterShowValue: string;
  isLoading: boolean;
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  productsCategory: PromiseProductCategory[];
  singleProduct: PromiseSingleEditProduct;
};

export type SingleProductCreate = {
  photos: File[];
  name: string;
  category_id: any;
  price: string | currency;
  description: string;
};

export type SingleProductEdit = {
  id: string;
  photos?: File[];
  is_draft?: boolean;
  current_photo_ids?: string[];
  name?: string;
  description?: string;
  price?: string;
  category_id?: string;
};
