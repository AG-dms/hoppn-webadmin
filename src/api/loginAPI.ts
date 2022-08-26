import { UserType, RefreshedTokens, PhoneLogin, UserTypePhone } from '@/store/slices/Auth/types';
import { PromiseConfirmPhone } from './dto/UserResponseData';
import { instance } from './interceptors';

export async function apiUserLogin(email: string, password: string): Promise<UserType> {
  const response = await instance.post('/api/v1/auth/login', {
    email,
    password,
  });
  return response.data;
}

export async function apiUserLoginPhone(phone_number: string): Promise<string> {
  const response = await instance.post('/api/v1/auth/phone-number', {
    phone_number,
  });
  return response.data;
}

export async function apiConfirmPhone(
  code: string,
  x_app_type: string,
  token: string,
): Promise<PromiseConfirmPhone> {
  const response = await instance.post(
    '/api/v1/auth/phone-number/confirm',
    {
      code,
    },
    {
      headers: {
        'x-app-type': x_app_type,
        'authorization-token': token,
      },
    },
  );
  return response.data;
}

export async function apiUserRegistration(email: string, password: string): Promise<UserType> {
  const response = await instance.post('/api/v1/auth/registration', {
    email,
    password,
  });
  return response.data;
}

export async function apiUserLogout(): Promise<unknown> {
  return instance.post('/api/v1/auth/logout', {});
}

export async function apiRefresh(refresh: string): Promise<RefreshedTokens> {
  const response = await instance.get<RefreshedTokens>('/api/v1/auth/refresh', {
    params: {},
    headers: {
      'refresh-token': refresh,
    },
  });
  return response.data;
}

export async function apiEmailConfirm(token: string): Promise<void> {
  return await instance.post(
    '/api/v1/users/me/profile/email/confirm',
    {},
    {
      headers: {
        'email-confirmation-token': token,
      },
    },
  );
}
