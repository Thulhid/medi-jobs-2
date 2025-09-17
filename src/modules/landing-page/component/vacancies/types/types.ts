export interface Vacancy {
    id: number;
    designation: string;
    city: string;
    country: string;
    summary: string;
    banner: string;
    startDate: string;
    endDate: string;
    noOfPositions: number;
    contactPerson: string;
    email: string;
    portalUrl?: string;
    hospital: {
        id: number;
        name: string;
        logo: string;
    };
    corporateTitle: {
        id: number;
        name: string;
    };
    employmentType: {
        id: number;
        name: string;
    };
    workPlaceType: {
        id: number;
        name: string;
    };
    sbu: {
        id: number;
        name: string;
    };
    clicks: {
        id: number;
        createdAt: string;
    }[];
}
