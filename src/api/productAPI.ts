import { PromiseProductsData, PromiseSingleAdminProduct } from './dto/ProductsResponseData';
import { PromiseSingleOrder } from './dto/OrdersResponse.dto';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { instance } from './interceptors';

export async function apiGetProductsList(
  offset?: number,
  limit?: number,
  search?: string,
  column?: SortParamsType,
  operator?: OperatorType,
  sort?: SortParamsType,
  direction?: 'asc' | 'desc',
): Promise<PromiseProductsData> {
  const response = await instance.get('/api/v1/products', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiGetAdminSingleProduct(id: string): Promise<PromiseSingleAdminProduct> {
  const response = await instance.get(`/api/v1/products/${id}`);
  return response.data;
}
