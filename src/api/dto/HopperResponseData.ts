export type PromiseHopperListData = {
  count: number;
  rows: HopperItem[];
};

export type HopperItem = {
  id: string;
  user: {
    id: string;
    email: string;
    photo: 'string';
    is_email_verified: boolean;
    phone_number: string;
    is_phone_number_verified: boolean;
    first_name: string;
    last_name: string;
  };
  nin: string;
  bvn: string;
  legal_information: string;
  description: string;
  is_online: boolean;
  is_approved: boolean;
  created_at: string;
};

export type PromiseSingleHopper = {
  id: string;
  user: {
    balance: string;
    id: string;
    email: string;
    photo: string;
    is_email_verified: boolean;
    phone_number: string;
    is_phone_number_verified: boolean;
    first_name: string;
    last_name: string;
  };
  nin: string;
  bvn: string;
  legal_information: string;
  description: string;
  is_online: boolean;
  is_approved: boolean;
  created_at: string;
};
