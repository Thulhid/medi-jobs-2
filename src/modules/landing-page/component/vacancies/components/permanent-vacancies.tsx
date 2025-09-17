"use client";

import Image from "next/image";
import {useGetAllVacancies} from "@/modules/shared/hooks/vacancies/use-get-all-vacancies";
import {useState} from "react";
import {useGetAllHospitals} from "@/modules/shared/hooks/hospitals/use-get-all-hospitals";
import {DashboardCombobox} from "@/modules/shared/dashboard-combobox";
import {useGetAllCorporateTitles} from "@/modules/shared/hooks/corporate-titles/use-get-all-corporate-titles";

export const PermanentVacancies = () => {
    const {vacanciesData, isVacanciesDataLoading} = useGetAllVacancies()
    const {hospitalData, isHospitalDataLoading} = useGetAllHospitals()
    const {corporateTitleData,isCorporateTitleDataLoading } = useGetAllCorporateTitles()

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedHospital, setSelectedHospital] = useState("")
    const [selectedCorporateTitle, setSelectedCorporateTitle] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedDate, setSelectedDate] = useState("")

    console.log(123, hospitalData)

    console.log(765, selectedHospital)

    // const filteredSearch = vacanciesData?.filter((data) => ())

    return (
        <div className="w-full mb-4">

            <div className="items-center justify-center w-full relative">
                <Image
                    src={'/images/landing-page-slider/image1.jpg'}
                    alt={'medijobs.lk'}
                    width={1920}
                    height={1080}
                    className={'w-full h-64 object-cover'}
                />
            </div>

            <div className="w-full max-w-[1440px] mx-auto top-64 z-10 px-4 ">
                <div className="flex items-center justify-start mt-4">
                    <h1 className="text-2xl font-semibold mb-4">Permanent Vacancies</h1>
                </div>

                <div className={'grid grid-cols-4 gap-4'}>
                    <DashboardCombobox
                        options={hospitalData?.map((hospital: {id:string, name:string}) => ({ label: hospital.name, value: hospital.id })) || []}
                        name="hospital"
                        onChange={setSelectedHospital}
                        value={selectedHospital}
                    />

                    <DashboardCombobox
                        options={corporateTitleData?.map((title: {id:string, name:string}) => ({ label: title.name, value: title.id })) || []}
                        name="corporate title"
                        onChange={setSelectedCorporateTitle}
                        value={selectedCorporateTitle}
                    />

                </div>

            </div>
        </div>
    );
}
