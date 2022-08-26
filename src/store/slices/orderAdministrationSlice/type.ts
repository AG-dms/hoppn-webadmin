import { AllOrdersItem, PromiseSingleOrder } from '@/api/dto/OrdersResponse.dto';
import { UserListData } from '@/api/dto/UserResponseData';
import {
  PromiseSingleVendorApplication,
  VendorApplicationType,
  VendorFile,
} from '@/api/dto/VendorResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type ProductsAdministrationInitialState = {
  productsList: AllOrdersItem[];
  singleOrder: PromiseSingleOrder;
  count: number;
  filterShowValue: string;
  isLoading: boolean;
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
};
