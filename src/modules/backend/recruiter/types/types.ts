import { RecruiterType } from "@prisma/client";

export type Recruiter = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  recruiterTypeId: number;
  hospitalId: number;
  userId: number;
  createdAt: Date;
  hospital: {
    id: number;
    name: string;
  };
  recruiterType: RecruiterType;
};
