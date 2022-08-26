import { PromiseAllOrders, PromiseSingleOrder } from './dto/OrdersResponse.dto';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { instance } from './interceptors';

export async function apiGetAllOrders(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseAllOrders> {
  const response = await instance.get('/api/v1/orders', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiGetAdminSingleOrder(id: string): Promise<PromiseSingleOrder> {
  return (await instance.get(`/api/v1/orders/${id}`, {})).data;
}
