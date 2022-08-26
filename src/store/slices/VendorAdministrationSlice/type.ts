import {
  PromiseSingleVendorApplication,
  VendorApplicationType,
  VendorFile,
  VendorRegistrationForm,
} from '@/api/dto/VendorResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type VendorsApplicationsInitialState = {
  vendorApplicationsList: VendorApplicationType[];
  count: number;
  filterShowValue: string;
  isLoading: boolean;
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  singleVendorApplication: SingleVendorData;
};

export type SingleVendorData = {
  data: PromiseSingleVendorApplication;
  files?: VendorFile[];
  loadingVendor: boolean;
};
