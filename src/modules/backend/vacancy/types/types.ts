export type Vacancy = {
  id: number;
  city: string;
  corporateTitleId: number;
  country: string;
  designation: string;
  email: string;
  employmentTypeId: number;
  endDate: Date;
  noOfPositions: number;
  sbuId: number;
  startDate: Date;
  
  summary: string;
  workPlaceTypeId: number;
  hospitalId: number;
  recruiterId: number;
  banner: string;
  contactPerson: string;
  portalUrl?: string | null;
  readStatus: string;
  statusId: number;
  vacancyOption?: string | null;
  createdAt: Date;
  hospital?: { id: number; name: string; logo?: string | null };
  corporateTitle?: { id: number; name: string };
  employmentType?: { id: number; name: string };
  workPlaceType?: { id: number; name: string };
  sbu?: { id: number; name: string };
  status?: { id: number; name: string; metaCode?: string };
  recruiter?: {
    id: number;
    userId?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  clicks?: Array<{ id: number; createdAt: Date }>;
};
