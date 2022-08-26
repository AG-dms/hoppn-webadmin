import { PromiseHopperListData, PromiseSingleHopper } from './dto/HopperResponseData';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { VendorFile } from './dto/VendorResponseData';
import { instance } from './interceptors';

export async function apiGetHopperAdministrationList(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseHopperListData> {
  const response = await instance.get('/api/v1/hoppers', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiGetSingleHopper(id: string): Promise<PromiseSingleHopper> {
  const response = await instance.get(`/api/v1/hoppers/${id}`, {});
  return response.data;
}

export async function apiApproveHopper(id: string, is_approved: boolean): Promise<void> {
  const response = await instance.put(`/api/v1/hoppers/${id}/approve`, { is_approved });
  return response.data;
}

export async function apiGetHopperFiles(id: string): Promise<VendorFile[]> {
  const response = await instance.get(`/api/v1/hoppers/${id}/files`, {});
  return response.data;
}

export async function apiChangeHopperBalance(amount: string, id: string) {
  return await instance.post(`/api/v1/hoppers/${id}/balance/credit`, { amount: amount });
}
