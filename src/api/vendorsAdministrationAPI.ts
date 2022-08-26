import { AxiosResponse } from 'axios';
import contentDisposition from 'content-disposition';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { VendorApproveRegistration } from './dto/VendorRequestData';
import {
  PromiseSingleVendorApplication,
  PromiseVendorApplicationsList,
  VendorApplicationType,
  VendorFile,
} from './dto/VendorResponseData';
import { instance } from './interceptors';

export async function apiGetVendorsApplicationsList(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseVendorApplicationsList> {
  const response = await instance.get('/api/v1/vendors', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiGetSingleVendor(id: string): Promise<PromiseSingleVendorApplication> {
  const response = await instance.get(`/api/v1/vendors/${id}`, {});
  return response.data;
}

export async function apiApproveVendor(id: string, is_approved: boolean): Promise<void> {
  return await instance.put(`/api/v1/vendors/${id}/approve/`, {
    is_approved,
  });
}

export async function apiApproveVendorRegistration(
  id: string,
  {
    company_name,
    company_category_ids,
    plus_code,
    latitude,
    longitude,
    address_line_1,
    address_line_2,
    country,
    city,
    district,
    postcode,
  }: {
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
  },
): Promise<void> {
  return await instance.put(`/api/v1/vendors/${id}/approve`, {
    company_name,
    company_category_ids,
    plus_code,
    latitude,
    longitude,
    address_line_1,
    address_line_2,
    country,
    city,
    district,
    postcode,
  });
}

export async function apiUpdateVendorInformation(
  id: string,
  {
    company_name,
    company_category_ids,
    plus_code,
    latitude,
    longitude,
    address_line_1,
    address_line_2,
    country,
    city,
    district,
    postcode,
  }: {
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
  },
): Promise<void> {
  return await instance.put(`/api/v1/vendors/${id}`, {
    company_name,
    company_category_ids,
    plus_code,
    latitude,
    longitude,
    address_line_1,
    address_line_2,
    country,
    city,
    district,
    postcode,
  });
}

export async function apiDeclineVendorRegistration(id: string): Promise<void> {
  return await instance.put(`/api/v1/vendors/${id}/decline`);
}

export async function apiGetSingleVendorFiles(id: string): Promise<VendorFile[]> {
  const response = await instance.get(`/api/v1/vendors/${id}/files`, {});
  return response.data;
}

export async function downloadFile(id: string, file_id: string) {
  const response = await instance.get(`/api/v1/vendors/${id}/files/${file_id}`, {
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

export async function apiChangeVendorBalance(
  amount: string,
  id: string,
): Promise<AxiosResponse<any, any>> {
  return await instance.post(`/api/v1/vendors/${id}/balance/debit`, { amount });
}

export async function downloadFileHopper(id: string, file_id: string) {
  const response = await instance.get(`/api/v1/hoppers/${id}/files/${file_id}`, {
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
