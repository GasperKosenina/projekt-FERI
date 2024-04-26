export type Item = {
    id : number;
    name : string;
    description : string;
}

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
}
