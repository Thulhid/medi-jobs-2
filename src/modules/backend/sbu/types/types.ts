export type Sbu = {
  id: number;
  name: string;
  hospitalId: number;
  city: string;
  createdAt: Date;
  hospital: {
    id: number;
    name: string;
  };
};
