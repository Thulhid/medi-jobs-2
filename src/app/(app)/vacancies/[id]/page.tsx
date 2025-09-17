import {PublicVacancyDetail} from "@/modules/landing-page/component/vacancies/vacancy-detail";
import { notFound } from "next/navigation";

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const safeId = String(id || "");
  if (!safeId) notFound();
  return <PublicVacancyDetail id={safeId} />;
}
