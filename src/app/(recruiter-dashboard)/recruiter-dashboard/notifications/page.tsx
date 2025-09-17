import NotificationsList from "@/modules/recruiterDashboard/notifications/components/notifications-list";

export default function RecruiterNotificationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-gray-600">
          See updates when your vacancies are approved or rejected.
        </p>
      </div>
      <NotificationsList />
    </div>
  );
}
