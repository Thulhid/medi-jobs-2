import PublicLocumVacancyDetail from "@/modules/landing-page/component/locum-vacancy/vacancy-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicLocumVacancyPage({ params }: PageProps) {
  const { id } = await params;
  return <PublicLocumVacancyDetail id={id} />;
}