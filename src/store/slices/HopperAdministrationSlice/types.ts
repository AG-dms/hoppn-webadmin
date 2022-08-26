import { HopperItem, PromiseSingleHopper } from '@/api/dto/HopperResponseData';
import { VendorFile } from '@/api/dto/VendorResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type HopperAdministrationInitialState = {
  hopperListData: HopperItem[];
  count: number;
  filterShowValue: string;
  isLoading: boolean;
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  // singleHopper: HopperData;
};

export type HopperData = {
  isLoading: boolean;
  data: PromiseSingleHopper;
  files: VendorFile[];
};
