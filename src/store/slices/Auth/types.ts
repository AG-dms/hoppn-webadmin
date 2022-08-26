import { Role } from '@/utils/enum/Role';

export type LoginInitialStateType = {
  access_token: string | null;
  refresh_token: null | string;
  user_id: null | string;
  user_roles: Role[] | null;
  isLoading: boolean;
  authorization_token: string;
  passwordRestored: boolean;
  inviteToken: string;
};

export type RefreshedTokens = {
  access_token: string;
  refresh_token: string;
};

export type RefreshResponse = {
  tokens: RefreshedTokens;
  decode: {
    id: string;
    roles: Role[];
  };
};

export type UserType = {
  access_token: string;
  refresh_token: string;
  user_id: string;
  user_roles: Role[];
};

export type PhoneLogin = {
  authorization_token: string;
};

export type UserTypePhone = {
  response: {
    access_token: string;
    refresh_token: string;
  };

  decode: {
    id: string;
    roles: Role[];
  };
};

export type ResponseLogin = {
  response: {
    access_token: string;
    refresh_token: string;
    user_id: string;
    user_roles: Role[];
  };

  decode: {
    id: string;
    roles: Role[];
  };
};

export type loginType = {
  userName: string;
  password: string;
};

export type ServerError = {
  statusCode: number;
  description: string;
};
