import { PromiseSingleUser } from '@/api/dto/UserResponseData';

export type ProfileInitialState = {
  profile?: SingleUser;
  isLoading: boolean;
};

export type SingleUser = {
  id: string;
  email?: string;
  is_email_verified?: boolean;
  phone_number?: string;
  is_phone_number_verified?: boolean;
  is_password_set?: boolean;
  first_name?: string;
  last_name?: string;
  balance: string;
  roles?: Roles[];
  vendor_profile: {
    id: string;
  };
};

export type Roles = {
  id: string;
  name: string;
};
