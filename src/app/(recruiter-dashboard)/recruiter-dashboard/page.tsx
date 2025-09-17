import RecruiterDashboard from "@/modules/recruiterDashboard/RecruiterDashboard";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function RecruiterDashboardPage() {
  // Server-side role-based redirect
  const session = await getServerSession();
  const role = String(
    (session as { user?: { role?: { metaCode?: string } } })?.user?.role
      ?.metaCode || "",
  ).toUpperCase();
  if (role.includes("LEAD")) {
    redirect("/lead-recruiter-fdashborad");
  }
  return <RecruiterDashboard />;
}
