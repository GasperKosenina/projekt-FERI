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
};

export type Payment = {
  id?: string;
  datasetId: string;
  userId: string;
  accessToken: boolean;
  paymentStatus: boolean;
  createdAt?: Date;
};
