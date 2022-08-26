import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { PromiseVendorOrdersList } from './dto/VendorResponseData';
import { instance } from './interceptors';

export async function apiGetVendorOrdersList(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseVendorOrdersList> {
  const response = await instance('/api/v1/users/me/profile/vendor/orders', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });

  return response.data;
}
