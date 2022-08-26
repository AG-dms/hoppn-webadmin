export type PromiseProductsData = {
  count: number;
  rows: ProductData[];
};

export type ProductData = {
  id: string;
  name: string;
  price: string;
  category: {
    id: string;
    name: string;
  };
  photos: [
    {
      id: string;
      name: string;
    },
  ];
  vendor_profile: {
    id: string;
    logo: string;
    company_name: string;
  };
};

export type PromiseSingleAdminProduct = {
  id: string;
  name: string;
  price: string;
  description: string;
  is_draft: boolean;
  photos: [
    {
      id: string;
      name: string;
    },
  ];
  category: {
    id: string;
    name: string;
  };
  vendor_profile: {
    id: string;
    logo: string;
    company_name: string;
    owner: {
      id: string;
      photo: string;
      email: string;
      is_email_verified: boolean;
      phone_number: string;
      is_phone_number_verified: boolean;
      first_name: string;
      last_name: string;
    };
  };
  created_at: string;
  updated_at: string;
};
