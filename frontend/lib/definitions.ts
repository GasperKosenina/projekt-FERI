export type Dataset = {
  id?: string;
  name: string;
  url: string;
  accessToken: string;
  price: number;
  description: any;
  duration: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  userID: string;
};
