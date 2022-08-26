import currency from 'currency.js';
import { PromiseSingleUser } from './UserResponseData';

export type PromiseVendorProfileData = {
  id: string;
  logo: string;
  company_name: string;
  company_category: PromiseVendorCategory[];
  address: Address;
  legal_information: string;
  description: string;
  is_online: boolean;
  is_bargaining: boolean;
  avg_preparation_time: string;
  is_approved: boolean;
  created_at: string;
};

export type PromiseVendorFiles = {
  files: VendorFile[];
};

export type Address = {
  id: string;
  country: string;
  city: string;
  district: string;
  postcode: string;
  plus_code: string;
  address_line_1: string;
  address_line_2: string;
  latitude: number;
  longitude: number;
};

// export type PromiseInviteMember = {
//   link: string;
// };

export type VendorFile = {
  id: string;
  original_name: string;
  file_size: number;
  created_at: string;
};

export type PromiseVendorApplicationsList = {
  count: number;
  rows: VendorApplicationType[];
};

export type VendorApplicationType = {
  id: string;
  owner: Owner;
  logo: string;
  company_name: string;
  company_category: PromiseVendorCategory;
  address: Address | null;
  is_online: boolean;
  is_approved: boolean;
  created_at: string;
};

export type PromiseSingleVendorApplication = {
  id: string;
  owner: Owner;
  logo: string;
  company_name: string;
  company_categories: PromiseVendorCategory[];
  address: Address;
  legal_information: string;
  description: string;
  is_online: boolean;
  is_approved: string;
  created_at: string;
  registration_form: VendorRegistrationForm;
};

export type Owner = {
  id: string;
  balance: string;
  email: string;
  is_email_verified: boolean;
  phone_number: string;
  is_phone_number_verified: boolean;
  first_name: string;
  last_name: string;
};

export type PromiseVendorEmployees = {
  count: number;
  rows: PromiseSingleUser[];
};

export type PromiseVendorProducts = {
  count: number;
  rows: SingleProduct[];
};

export type SingleProduct = {
  id: string;
  name: string | currency;
  price: string;
  category: {
    name: string;
  };
  is_draft: string;
  created_at: string;
};

export type PromiseProductCategory = {
  id: string;
  name: string;
};

export type PromiseVendorCategory = {
  id: string;
  name: string;
  fees: string;
};

export type PromiseSingleEditProduct = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  photos: Photo[];
  is_draft: boolean;
  created_at: string;
};

export type Photo = {
  id: string;
  name: string;
};

export type PromiseVendorOrdersList = {
  count: number;
  rows: VendorOrderList[];
};

export type VendorOrderList = {
  id: string;
  price: string;
  total_price: string;
  status: string;
  payment_type: string;
  offer_price: string;
  counteroffer_price: string;
  user_comment: string;
  vendor_comment: string;
  preparation_time: number;
  accepted_at: string;
  ready_at: string;
  sent_at: string;
  delivered_at: string;
  fulfilled_at: string;
  canceled_at: string;
  created_at: string;
};

export type ApiAddress = {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  address_components: Address_Components[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export type Address_Components = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type GoogleMap = {
  country?: string;
  city?: string;
  district?: string;
  postcode?: string;
  plus_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
};

export type VendorRegistrationForm = {
  id: string;
  company_name: string;
  address: string;
  description: string;
  takeaway_food: string;
  registered_business: string;
  business_license: string;
  created_at: string;
  company_categories: [
    {
      id: string;
      name: string;
    },
  ];
};
