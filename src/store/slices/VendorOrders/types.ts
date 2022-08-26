import { PromiseSingleOrder } from '@/api/dto/OrdersResponse.dto';
import { VendorOrderList } from '@/api/dto/VendorResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type VendorOrdersInitialState = {
  count: number;
  isLoading: boolean;
  singleOrder: PromiseSingleOrder;
  filterShowValue: string;
  vendorOrdersList: VendorOrderList[];
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
};
