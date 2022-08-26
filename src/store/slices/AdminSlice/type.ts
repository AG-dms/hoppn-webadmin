import { UserListData } from '@/api/dto/UserResponseData';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';

export type AdminInitialState = {
  usersList: UserListData[];
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

export type VendorProfile = {
  id: string;
  company_name: string;
  company_category: string;
  address_line_2: string;
  legal_information: string;
  description: string;
  is_approved: boolean;
  created_at: string;
  files: {
    id: string;
    original_name: string;
    file_size: number;
  };
};
export type SingleAdmin = {
  id?: string;
  email?: string;
  is_email_verified?: boolean;
  phone_number?: string;
  is_phone_number_verified?: boolean;
  first_name?: string;
  last_name?: string;
  vendor_profile?: VendorProfile;
  roles?: string[];
};
