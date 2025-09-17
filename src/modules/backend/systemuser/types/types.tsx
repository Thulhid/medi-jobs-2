export type SystemUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  userId: number;
  createdAt: Date;
  user?: {
    id: number;
  };
};
