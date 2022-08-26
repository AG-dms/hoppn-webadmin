import { PromiseVendorCategory } from './VendorResponseData';

export type CreateVendor = {
  logo: File;
  company_name: string;
  company_category: string[];
  plus_code: string;
  legal_information?: string;
  description?: string;
  address_line_1?: string;
  address_line_2?: string;
  country?: string;
  city?: string;
  district?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
};

export type EditVendorProfile = {
  logo?: File;
  is_bargaining: boolean;
  avg_preparation_time: string;
  company_name: string;
  plus_code: string;
  company_category_ids: string[];
  legal_information?: string;
  description?: string;
  address_line_1?: string;
  address_line_2?: string;
  country?: string;
  city?: string;
  district?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
};

export type PromiseInviteMemberRole = {
  type: string;
};

export type VendorApproveRegistration = {
  company_name: string;
  company_category_ids: string[];
  plus_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
  address_line_2: string;
  country: string;
  city: string;
  district: string;
  postcode: string;
};

// export type Photo = {

// }
