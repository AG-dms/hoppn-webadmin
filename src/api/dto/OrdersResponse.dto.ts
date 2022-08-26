export type PromiseSingleOrder = {
  id: string;
  price: string;
  total_price: string;
  status: string;
  payment_type: string;
  offer_price: string;
  counteroffer_price: string;
  user_comment: string;
  vendor_comment: string;
  preparation_time: number;
  created_at: string;
  updated_at: string;
  accepted_at: string;
  paid_at: string;
  ready_at: string;
  shipped_at: string;
  fulfilled_at: string;
  canceled_at: string;
  user: User;
  user_address: Address;
  vendor: Vendor;
  vendor_address: Address;
  cart: SingleCart;
  hopper_profile: Hopper;
  payment: {
    id: string;
    action: string;
    type: string;
    requested_amount: string;
    amount: string;
    status: string;
    pst_transaction_reference: string;
    pst_transaction_id: number;
    pst_transaction_fees: number;
    created_at: string;
    updated_at: string;
    transactions: [
      {
        id: string;
        user_id: string;
        type: string;
        amount: string;
        created_at: string;
      },
    ];
  };
  hopper_metadata: [
    {
      hopper_profile: Hopper;
      rejected_reason: string;
      rejected_at: string;
      accepted_at: string;
      received_at: string;
      delivered_at: string;
    },
  ];
};

export type Vendor = {
  id: string;
  owner_id: string;
  company_name: string;
  logo: string;
};

export type PromiseAllOrders = {
  count: number;
  rows: AllOrdersItem[];
};

export type AllOrdersItem = {
  id: string;
  price: string;
  total_price: string;
  payment_amount: string;
  platform_fee: string;
  shipping_price: string;
  status: string;
  payment_type: string;
  offer_price: string;
  counteroffer_price: string;
  preparation_time: number;
  created_at: string;
  paid_at: string;
  shipped_at: string;
  updated_at: string;
  accepted_at: string;
  ready_at: string;
  sent_at: string;
  delivered_at: string;
  fulfilled_at: string;
  canceled_at: string;
};

export type Hopper = {
  id: string;
  user: User;
};

export type User = {
  id: string;
  phone_number: string;
  is_phone_number_verified: boolean;
  email: string;
  first_name: string;
  last_name: string;
};

export type Address = {
  id: string;
  country: string;
  city: string;
  district: string;
  plus_code?: string;
  postcode: string;
  address_line_1: string;
  address_line_2: string;
  latitude: number;
  longitude: number;
};

export type SingleCart = [
  {
    product_snapshot: {
      id: string;
      name: string;
      price: string;
      description: string;
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
      created_at: string;
    };
    quantity: number;
  },
];
