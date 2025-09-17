"use client";

import { ReactNode } from "react";
import { Avatar } from "./avatar";
import { StatusBadge } from "./status-badge";
import { Card } from "./card";

export interface NotificationCardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  status?: string;
  isRead?: boolean;
  avatar?: {
    src?: string | null;
    alt: string;
  };
  content?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function NotificationCard({
  title,
  subtitle,
  status,
  isRead = false,
  avatar,
  content,
  actions,
  onClick,
  className = "",
}: NotificationCardProps) {
  const cardClass = isRead
    ? "bg-gray-50 border-gray-200"
    : "bg-green-50 border-green-200";

  return (
    <Card
      className={`${cardClass} ${className}`}
      hover={!!onClick}
      onClick={onClick}
      padding="md"
    >
      <div className="flex items-start gap-3">
        {avatar && (
          <Avatar src={avatar.src} alt={avatar.alt} size="md" shape="square" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">{title}</h4>
            {status && <StatusBadge status={status} />}
            {!isRead && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-600 mb-2">{subtitle}</p>}
          {content && <div className="text-sm">{content}</div>}
        </div>
      </div>
      {actions && <div className="mt-3 flex justify-end">{actions}</div>}
    </Card>
  );
}

// Grid layout for notifications
export interface NotificationGridProps {
  children: ReactNode;
  className?: string;
}

export function NotificationGrid({
  children,
  className = "",
}: NotificationGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
