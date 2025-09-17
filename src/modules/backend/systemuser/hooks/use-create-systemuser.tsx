import { useState } from "react";
import { SystemUser } from "@/modules/backend/systemuser/types/types";

interface CreateSystemUserData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  userId: number;
}

export const useCreateSystemUser = () => {
  const [systemUser, setSystemUser] = useState<SystemUser | null>(null);
  const [systemUserLoading, setSystemUserLoading] = useState<boolean>(false);

  const createSystemUser = async (data: CreateSystemUserData) => {
    try {
      setSystemUserLoading(true);
      const response = await fetch("/api/backend/system-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to create SystemUser`,
        );
      }

      const createdSystemUser = await response.json();
      setSystemUser(createdSystemUser);
      return createdSystemUser;
    } catch (err) {
      console.error("Error creating SystemUser:", err);
      throw err;
    } finally {
      setSystemUserLoading(false);
    }
  };

  return { createSystemUser, systemUser, systemUserLoading };
};
