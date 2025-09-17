"use client";

import useSWR from "swr";
import {
  NotificationCard,
  NotificationGrid,
} from "@/modules/shared/components/notification-card";
import {
  EmptyState,
  EmptyIcons,
} from "@/modules/shared/components/empty-state";

type NotificationItem = {
  id: number;
  designation: string;
  status: { name: string };
  createdAt: string;
  startDate: string;
  endDate: string;
  readStatus?: string;
  rejectionReason?: string | null;
  hospital: { id: number; name: string; logo: string | null };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export default function NotificationsList() {
  const { data, isLoading, error, mutate } = useSWR<NotificationItem[]>(
    "/api/backend/notifications",
    fetcher,
  );

  if (isLoading) {
    return (
      <NotificationGrid>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-44 bg-green-100 rounded animate-pulse" />
        ))}
      </NotificationGrid>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load notifications"
        description="There was an error loading your notifications. Please try again."
        icon={<EmptyIcons.Inbox />}
      />
    );
  }

  const items = data ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="No notifications yet"
        description="You'll see notifications here when there are updates on your vacancies."
        icon={<EmptyIcons.Inbox />}
      />
    );
  }

  const handleMarkAsRead = async (vacancyId: number) => {
    try {
      const res = await fetch(`/api/backend/vacancy/${vacancyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readStatus: "Read" }),
      });
      if (res.ok) mutate();
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  return (
    <NotificationGrid>
      {items.map((n) => {
        const isRead = (n.readStatus ?? "").toLowerCase() === "read";
        const statusName = n.status?.name ?? "";
        const isRejected = String(statusName || "")
          .toLowerCase()
          .includes("reject");

        return (
          <NotificationCard
            key={n.id}
            id={n.id}
            title={n.designation}
            subtitle={`${n.hospital?.name} • Posted ${new Date(n.startDate).toLocaleDateString()} • Ends ${new Date(n.endDate).toLocaleDateString()}`}
            status={statusName}
            isRead={isRead}
            avatar={{
              src: n.hospital?.logo,
              alt: n.hospital?.name ?? "Hospital",
            }}
            content={
              isRejected &&
              n.rejectionReason && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded p-2">
                  <strong>Reason:</strong> {n.rejectionReason}
                </div>
              )
            }
            actions={
              !isRead && (
                <button
                  className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  Mark as read
                </button>
              )
            }
          />
        );
      })}
    </NotificationGrid>
  );
}
