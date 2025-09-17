import { useState } from "react";
import { SystemUser } from "@/modules/backend/systemuser/types/types";

interface UpdateSystemUserData {
  name: string;
  logo: string;
  email: string;
  description: string;
  banner: string;
}

export const useUpdateSystemUser = () => {
  const [systemUser, setSystemUser] = useState<SystemUser | null>(null);
  const [systemUserLoading, setSystemUserLoading] = useState<boolean>(false);

  const updateSystemUser = async (id: string, data: UpdateSystemUserData) => {
    try {
      setSystemUserLoading(true);
      const response = await fetch(`/api/backend/sbu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update systemUser with ID ${id}`);
      }

      const updatedSystemUser = await response.json();
      setSystemUser(updatedSystemUser);
      return updatedSystemUser;
    } catch (err) {
      console.error(`Error updating systemUser with ID ${id}:`, err);
      return null;
    } finally {
      setSystemUserLoading(false);
    }
  };

  return { updateSystemUser, systemUser, systemUserLoading };
};
