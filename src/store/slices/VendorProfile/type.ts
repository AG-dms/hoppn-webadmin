import {
  Address,
  ApiAddress,
  GoogleMap,
  PromiseProductCategory,
  PromiseVendorCategory,
  PromiseVendorFiles,
  VendorFile,
  VendorRegistrationForm,
} from '@/api/dto/VendorResponseData';

export type VendorInitialState = {
  profile?: VendorProfile;

  isLoading: boolean;
  isLoadingFile: boolean;
  isLoadingLogo: boolean;
  inviteLink: string;
  vendorCategories: PromiseVendorCategory[];
  registrationForm: VendorRegistrationForm;
};

export type VendorProfile = {
  id?: string;
  company_name?: string;
  company_categories?: PromiseVendorCategory[];
  legal_information?: string;
  description?: string;
  address: Address;

  is_bargaining?: boolean;
  avg_preparation_time: string;
  is_approved?: boolean;
  is_online: boolean;
  created_at?: string;
  files?: VendorFile[];
  logo: string;
  apiAddress?: object;
};

export type VendorRegistration = {
  files: File;
  company_name: string;
  company_category: string[];
  address: string;
  description: string;
  takeaway_food: string;
  registered_business: string;

  business_license: string;
};

export type EditVendorRegistration = {
  company_name: string;
  company_category_ids: string[];
  address: string;
  description: string;
  takeaway_food: string;
  registered_business: string;
  business_license: string;
};
