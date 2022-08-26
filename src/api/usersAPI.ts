import { SingleAdmin } from '@/store/slices/AdminSlice/type';
import { PromiseListUserData, PromiseSingleUser, UserListData } from './dto/UserResponseData';
import { formatDataBeforeFetch, OperatorType, SortParamsType } from './dto/UsersRequestData';
import { instance } from './interceptors';

export async function apiGetUserProfile(): Promise<PromiseSingleUser> {
  const response = await instance.get('/api/v1/users/me/profile');
  return response.data;
}

export async function apiUpdateProfile(first_name: string, last_name: string): Promise<void> {
  return instance.patch('/api/v1/users/me/profile', { first_name, last_name });
}

export async function apiUpdatePassword(password: string, new_password: string): Promise<void> {
  return instance.patch('/api/v1/users/me/profile/password', { password, new_password });
}

export async function apiAddPhoneNumber(phone_number: string): Promise<void> {
  return await instance.patch('/api/v1/users/me/profile/phone', { phone_number });
}

export async function apiConfirmPhone(phone_number: string, code: string): Promise<void> {
  return await instance.patch('/api/v1/users/me/profile/phone/confirm', { phone_number, code });
}

export async function apiCreatePassword(new_password: string): Promise<void> {
  return instance.post('/api/v1/users/me/profile/password', { new_password });
}

export async function apiChangeEmail(email: string): Promise<void> {
  return instance.patch('/api/v1/users/me/profile/email', { email });
}

export async function apiResendEmailCode(): Promise<void> {
  return instance.post('/api/v1/users/me/profile/email/resend', {});
}

export async function apiGetUsersList(
  offset: number,
  limit: number,
  search: string,
  column: SortParamsType,
  operator: OperatorType,
  sort: SortParamsType,
  direction: 'asc' | 'desc',
): Promise<PromiseListUserData> {
  const response = await instance.get('/api/v1/users', {
    params: {
      ...formatDataBeforeFetch(offset, limit, search, column, operator, sort, direction),
    },
  });
  return response.data;
}

export async function apiUsersChangeStatus(id: string, status: string): Promise<void> {
  return await instance.patch(`/api/v1/users/${id}/status`, {
    status,
  });
}

export async function apiAcceptInvite(token: string): Promise<void> {
  return await instance.post(
    '/api/v1/users/me/profile/accept-invitation',
    {},
    {
      headers: {
        'invite-token': token,
      },
    },
  );
}

export async function apiGetSingleUser(id: string): Promise<UserListData> {
  const response = await instance.get(`/api/v1/users/${id}`, {});
  return response.data;
}
