interface ComingSoonVacancy {
    id: number;
    designation: string;
    city: string;
    country: string;
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
}


export const comingSoonVacancies: ComingSoonVacancy[] = [
    {
        id: 999991,
        designation: "Senior Cardiologist",
        city: "Colombo",
        country: "Sri Lanka",
        hospital: {
            id: 1001,
            name: "National Hospital",
            logo: "/images/sample/permenant-vacancy.jpg"
        },
        corporateTitle: {
            id: 2001,
            name: "Consultant"
        },
        employmentType: {
            id: 3001,
            name: "Full Time"
        },
        workPlaceType: {
            id: 4001,
            name: "On-site"
        }
    },
    {
        id: 999992,
        designation: "Pediatric Surgeon",
        city: "Kandy",
        country: "Sri Lanka",
        hospital: {
            id: 1002,
            name: "Kandy General Hospital",
            logo: "/images/sample/permenant-vacancy.jpg"
        },
        corporateTitle: {
            id: 2002,
            name: "Specialist"
        },
        employmentType: {
            id: 3001,
            name: "Full Time"
        },
        workPlaceType: {
            id: 4001,
            name: "On-site"
        }
    },
    {
        id: 999993,
        designation: "Radiology Technician",
        city: "Galle",
        country: "Sri Lanka",
        hospital: {
            id: 1003,
            name: "Galle District Hospital",
            logo: "/images/sample/permenant-vacancy.jpg"
        },
        corporateTitle: {
            id: 2003,
            name: "Technician"
        },
        employmentType: {
            id: 3001,
            name: "Full Time"
        },
        workPlaceType: {
            id: 4001,
            name: "On-site"
        }
    }
];
