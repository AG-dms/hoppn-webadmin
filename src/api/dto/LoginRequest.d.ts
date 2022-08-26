export interface authType {
  userName: string;
  password: string;
}

export type LoginPhoneType = {
  code: string;
  x_app_type: string;
  token: string;
};
