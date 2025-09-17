export type Hospital = {
  id: number;
  name: string;
  email: string;
  logo: string;
  city?: string | null;
  country?: string | null;
  mobile?: string | null;
  banner?: string | null;
  description: string;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  // Included by certain API responses (e.g., GET /api/backend/hospital/:id with include: { vacancy: true })
  vacancy?: HospitalVacancies["vacancy"];
};

export type HospitalVacancies = {
  id: number;
  name: string;
  email: string;
  banner?: string | null;
  logo: string;
  city?: string | null;
  country?: string | null;
  mobile?: string | null;
  description: string;
  vacancy: {
    id: number;
    designation: string;
    endDate: Date;
    corporateTitle: {
      id: number;
      name: string;
    };
    country: string;
    city: string;
  }[];
};
