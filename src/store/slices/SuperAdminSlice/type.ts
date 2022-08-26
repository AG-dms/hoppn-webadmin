import { PromiseSingleAdmin } from '@/api/dto/UserResponseData';
import { SortParamsType } from '@/api/dto/UsersRequestData';

export type SuperAdminInitialState = {
  adminList: SingleAdminData[];
  count: number;
  filterShowValue: string;
  isLoading: boolean;
  sortState: SortStateType;
  queryList: QueryListType;
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  singleAdmin: {
    isLoading: boolean;
    data: PromiseSingleAdmin;
  };
};

export type SortStateType = {
  sortParam: string;
  direction: 'asc' | 'desc' | '';
};

export type QueryListType = {
  offset?: number;
  limit?: number;
  search?: string;
  column?: SortParamsType;
  operator?: OperatorType;
  sort?: SortParamsType;
  direction?: 'asc' | 'desc';
};

export type OperatorType = 'co' | 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne' | 'sw';

export type SingleAdminData = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
};

export type NewAdmin = {
  email: string;
  password: string;
  lastQueryParams: QueryListType;
};

export type BlockAdmin = {
  id: string;
  status: string;
};
