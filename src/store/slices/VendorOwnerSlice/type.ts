import { UserListData } from '@/api/dto/UserResponseData';
import {
  PromiseSingleVendorApplication,
  VendorApplicationType,
  VendorFile,
} from '@/api/dto/VendorResponseData';
import { SingleUser } from '../Profile/type';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type VendorOwnerInitialState = {
  vendorEmployees: SingleUser[];
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
