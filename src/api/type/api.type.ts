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

export class PageResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalCount: number;

  constructor(items: T[], page: number, limit: number, totalCount: number) {
    this.items = items;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
  }
}
