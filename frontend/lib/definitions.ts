export type Dataset = {
  id?: string;
  name: string;
  url: string;
  accessToken: string;
  price: { purpose: string; price: number }[];
  description: any;
  duration: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  userID: string;
  show?: boolean;
};

export type Payment = {
  id?: string;
  datasetId: string;
  userId: string;
  accessToken: boolean;
  paymentStatus: boolean;
  amount: number;
  createdAt?: Date;
  tokenCreatedAt?: Date;
};

export type TokenRequest = {
  id?: string;
  reqUserID: string;
  providerID: string;
  datasetID: string;
  createdAt?: Date;
  paymentID: string;
  reason: string;
  seen: boolean;
  status: string;
  url?: string;
};
