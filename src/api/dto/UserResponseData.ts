import { VendorProfile } from '@/store/slices/AdminSlice/type';

export type AdminListData = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
};

export type UserListData = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  phone_number: string;
  is_phone_number_verified: boolean;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  roles: [
    {
      id: string;
      name: string;
    },
  ];
};

export type PromiseListAdminData = {
  count: number;
  rows: AdminListData[];
};

export type PromiseListUserData = {
  count: number;
  rows: UserListData[];
};

export type CreateAdmin = {
  id: string;
};

export type PromiseSingleUser = {
  id: string;
  email: string;
  is_email_verified: boolean;
  phone_number: string;
  is_phone_number_verified: boolean;
  first_name: string;
  last_name: string;
  balance: string;
  roles: SingleUserRoles[];
  vendor_profile: {
    id: string;
  };
};

export type SingleUserRoles = {
  id: string;
  name: string;
};

export type PromiseSingleAdmin = {
  ld: string;
  email: string;
  is_email_verified: boolean;
  first_name: string;
  last_name: boolean;
  status: string;
  created_at: string;
};

export type PromiseConfirmPhone = {
  access_token: string;
  refresh_token: string;
};
