import { PromiseSingleAdminProduct } from '@/api/dto/ProductsResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type ProductsListInitialState = {
  count: number;
  isLoading: boolean;
  // singleOrder: PromiseSingleOrder;
  filterShowValue: string;
  productsList: Product[];
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  singleProduct: PromiseSingleAdminProduct;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  category: {
    id: string;
    name: string;
  };
  photos: [
    {
      id: string;
      name: string;
    },
  ];
  vendor_profile: {
    id: string;
    logo: string;
    company_name: string;
  };
};
