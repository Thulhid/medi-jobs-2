import { useEffect, useState } from "react";
import { SystemUser } from "@/modules/backend/systemuser/types/types";

export const useGetSyatemUserById = (id: string) => {
  const [systemUser, setSystemUser] = useState<SystemUser | null>(null);
  const [systemUserLoading, setSystemUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSystemUser = async () => {
      if (!id) {
        setSystemUserLoading(false);
        return;
      }

      try {
        setSystemUserLoading(true);
        const response = await fetch(`/api/backend/system-user/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch SystemUser with ID ${id}`);
        }

        const data = await response.json();
        setSystemUser(data);
      } catch (err) {
        console.error(`Error fetching SystemUser with ID ${id}:`, err);
      } finally {
        setSystemUserLoading(false);
      }
    };

    fetchSystemUser();
  }, [id]);

  return { systemUser, systemUserLoading };
};
