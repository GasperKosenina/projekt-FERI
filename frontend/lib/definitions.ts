export type Dataset = {
  id?: string;
  name: string;
  url: string;
  accessToken: string;
  price: number;
  description: any;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
  userID: string;
};
