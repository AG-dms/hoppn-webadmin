import contentDisposition from 'content-disposition';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import {
  PromiseProductCategory,
  // PromiseInviteMember,
  PromiseVendorApplicationsList,
  PromiseVendorCategory,
  PromiseVendorEmployees,
  PromiseVendorFiles,
  PromiseVendorProducts,
  PromiseVendorProfileData,
  VendorFile,
  VendorRegistrationForm,
} from './dto/VendorResponseData';
import { instance } from './interceptors';

export async function apiGetRegistrationForm(): Promise<VendorRegistrationForm> {
  const response = await instance.get('/api/v1/users/me/profile/vendor/registration-form');
  return response.data;
}

export async function apiRegistrationVendor({
  files,
  company_name,
  company_category,
  address,
  description,
  takeaway_food,
  registered_business,
  business_license,
}: {
  files: File;
  company_name: string;
  company_category: string[];
  address: string;
  description: string;
  takeaway_food: string;
  registered_business: string;
  business_license: string;
}): Promise<void> {
  const form = new FormData();
  if (files) form.append('files', files);
  if (company_name) form.append('company_name', company_name);
  if (company_category) {
    company_category.forEach(id => {
      form.append('company_category_ids', id);
    });
  }
  if (description) form.append('description', description);
  if (address) form.append('address', address);
  if (takeaway_food) form.append('takeaway_food', takeaway_food);
  if (registered_business) form.append('registered_business', registered_business);
  if (business_license) form.append('business_license', business_license);

  return instance.post('/api/v1/users/me/profile/vendor/registration-form', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiEditVendorRegistration({
  company_name,
  company_category_ids,
  address,
  description,
  takeaway_food,
  registered_business,
  business_license,
}: {
  company_name: string;
  company_category_ids: string[];
  address: string;
  description: string;
  takeaway_food: string;
  registered_business: string;
  business_license: string;
}): Promise<void> {
  return instance.put('/api/v1/users/me/profile/vendor/registration-form', {
    company_name,
    company_category_ids,
    address,
    description,
    takeaway_food,
    registered_business,
    business_license,
  });
}

export async function apiCreateVendor({
  logo,
  company_category,
  company_name,
  address_line_1,
  address_line_2,
  legal_information,
  description,
  country,
  city,
  district,
  postcode,
  latitude,
  longitude,
  plus_code,
}: {
  logo: File;
  company_name: string;
  company_category: string[];
  plus_code: string;
  address_line_1?: string;
  address_line_2?: string;
  legal_information?: string;
  description?: string;
  country?: string;
  city?: string;
  district?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
}): Promise<void> {
  const form = new FormData();
  if (logo) form.append('logo', logo);
  if (company_name) form.append('company_name', company_name);
  if (company_category) {
    company_category.forEach(id => {
      form.append('company_category_ids', id);
    });
  }
  if (plus_code) form.append('plus_code', plus_code);
  if (address_line_1) form.append('address_line_1', address_line_1);
  if (address_line_2) form.append('address_line_2', address_line_2);
  if (legal_information) form.append('legal_information', legal_information);
  if (description) form.append('description', description);
  if (country) form.append('country', country);
  if (city) form.append('city', city);
  if (district) form.append('district', district);
  if (postcode) form.append('postcode', postcode);
  if (latitude) form.append('latitude', latitude.toString());
  if (longitude) form.append('longitude', longitude.toString());

  return instance.post(
    '/api/v1/users/me/profile/vendor',

    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export async function apiGetVendorCategories(): Promise<PromiseVendorCategory[]> {
  const response = await instance.get('/api/v1/vendor-categories', {});
  return response.data;
}

export async function apiAddFiles(file: File): Promise<void> {
  const form = new FormData();
  form.append('file', file);
  return instance.post(
    '/api/v1/users/me/profile/vendor/files',

    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export async function apiGetVendorProfile(): Promise<PromiseVendorProfileData> {
  const response = await instance.get('/api/v1/users/me/profile/vendor', {});

  return response.data;
}

export async function apiGetVendorFiles(): Promise<VendorFile[]> {
  const response = await instance.get('/api/v1/users/me/profile/vendor/files', {});
  return response.data;
}

export async function apiDeleteFile(id: string): Promise<void> {
  const response = await instance.delete(`/api/v1/users/me/profile/vendor/files/${id}`, {});
  return response.data;
}

export async function apiEditVendorProfile({
  avg_preparation_time,
  company_category_ids,
  company_name,
  plus_code,
  is_bargaining,
  legal_information,
  address_line_1,
  address_line_2,
  latitude,
  longitude,
  description,
  country,
  district,
  city,
  postcode,
}: {
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
}): Promise<void> {
  return instance.patch(
    '/api/v1/users/me/profile/vendor',

    {
      is_bargaining,
      company_category_ids,
      avg_preparation_time,
      address_line_1,
      address_line_2,
      plus_code,
      company_name,
      legal_information,
      description,
      country,
      district,
      city,
      postcode,
      latitude,
      longitude,
    },
  );
}

export async function apiSetCompanyLogo(logo: File): Promise<void> {
  const form = new FormData();
  if (logo) form.append('logo', logo);
  return instance.patch('/api/v1/users/me/profile/vendor/logo', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiInviteMember(type: string): Promise<string> {
  const response = await instance.post('/api/v1/users/me/profile/vendor/invite', {
    type,
  });
  return response.data;
}

export async function downloadFile(id: string) {
  const response = await instance.get(`/api/v1/users/me/profile/vendor/files/${id}`, {
    responseType: 'blob',
  });
  const content_disposition = contentDisposition.parse(response.headers['content-disposition']);
  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream',
  });
  const blobURL =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(blob)
      : window.webkitURL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;

  tempLink.setAttribute('download', content_disposition.parameters.filename);

  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 200);
}

export async function apiGetVendorEmployees(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseVendorEmployees> {
  const response = await instance.get('/api/v1/users/me/profile/vendor/users', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiDeleteEmployee(id: string): Promise<void> {
  return await instance.delete(`/api/v1/users/me/profile/vendor/users/${id}`, {});
}

export async function apiStoreOnline(is_online: boolean): Promise<void> {
  return await instance.put('/api/v1/users/me/profile/vendor/online', { is_online });
}
