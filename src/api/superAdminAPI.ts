import { instance } from './interceptors';
import { formatDataBeforeFetch, SortParamsType, OperatorType } from './dto/UsersRequestData';
import {
  AdminListData,
  CreateAdmin,
  PromiseListAdminData,
  PromiseSingleAdmin,
} from './dto/UserResponseData';
import { responsiveFontSizes } from '@mui/material';

export async function apiGetAdmins(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<{ data: PromiseListAdminData }> {
  return await instance.get('/api/v1/admins', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
}

export async function apiCreateAdmin(email: string, password: string): Promise<CreateAdmin> {
  return await instance.post('/api/v1/admins', { email, password });
}

// export async function apiGetSingleAdmin(id: string): Promise<AdminListData> {
//   return await instance.get(`/api/v1/admins/${id}`, {});
// }

export async function apiDeleteAdmin(id: string): Promise<void> {
  return await instance.delete(`/api/v1/admins/${id}`, {});
}

export async function apiBlockAdmin(id: string, status: string): Promise<void> {
  return await instance.patch(`/api/v1/admins/${id}/status`, { status });
}

export async function apiGetSingleAdmin(id: string): Promise<PromiseSingleAdmin> {
  const response = await instance.get(`/api/v1/admins/${id}`, {});
  return response.data;
}
