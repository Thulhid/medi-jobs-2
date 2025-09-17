export type User = {
  id: number;
  email: string;
  hashedPassword: string;
  roleId: number;
  createdAt: Date;
};
