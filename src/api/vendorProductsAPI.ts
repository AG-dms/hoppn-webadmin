import currency from 'currency.js';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import {
  PromiseProductCategory,
  PromiseSingleEditProduct,
  PromiseVendorProducts,
} from './dto/VendorResponseData';
import { instance } from './interceptors';

export async function apiGetVendorProducts(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseVendorProducts> {
  const response = await instance.get('/api/v1/users/me/profile/vendor/products', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiGetProductCategory(
  vendor_category_ids: string[],
): Promise<PromiseProductCategory[]> {
  const response = await instance.get('/api/v1/product-categories', {
    params: {
      vendor_category_ids,
    },
  });
  return response.data;
}

export async function apiCreateProduct(
  photos: File[],
  name: string,
  category_id: string,
  price: string | currency,
  description?: string,
): Promise<void> {
  const form = new FormData();
  if (photos) {
    photos.forEach(photo => {
      form.append('photos', photo);
    });
  }
  if (name) form.append('name', name);
  if (category_id) form.append('category_id', category_id);
  if (price) form.append('price', price.toString());
  if (description) form.append('description', description);

  return instance.post('/api/v1/users/me/profile/vendor/products', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiEditProduct(
  id: string,
  photos: File[],
  current_photo_ids: string[],
  name: string,
  category_id: string,
  price: string,
  is_draft?: boolean,
  description?: string,
): Promise<void> {
  const form = new FormData();
  if (photos) {
    photos.forEach(photo => {
      form.append('photos', photo);
    });
  }
  if (current_photo_ids) {
    current_photo_ids.forEach(photoId => {
      form.append('current_photo_ids', photoId);
    });
  }

  if (name) form.append('name', name);
  if (category_id) form.append('category_id', category_id);
  if (price) form.append('price', price);
  if (description) form.append('description', description);

  return instance.patch(`/api/v1/users/me/profile/vendor/products/${id}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiChangeProductDraft(id: string, is_draft: boolean): Promise<void> {
  return await instance.patch(`/api/v1/users/me/profile/vendor/products/${id}/draft`, { is_draft });
}

export async function apiGetSingleProduct(id: string): Promise<PromiseSingleEditProduct> {
  const response = await instance.get(`/api/v1/users/me/profile/vendor/products/${id}`);
  return response.data;
}

export async function apiDeleteProduct(id: string): Promise<void> {
  const response = await instance.delete(`/api/v1/users/me/profile/vendor/products/${id}`, {});
  return response.data;
}

// export async function apiEditProduct(id: string, photos: ) {

// }
