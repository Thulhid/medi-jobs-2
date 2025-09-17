export interface News {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  description: string;
  image: string;
  category: string;
}

export type UpdateNewsData = CreateNewsData;