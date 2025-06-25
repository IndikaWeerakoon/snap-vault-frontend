export type  CreateAccount =  {
    email: string;
    password: string;
    name: string;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}