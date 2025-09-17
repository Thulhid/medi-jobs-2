import { useEffect, useState } from "react";
import { UserRequest } from "@/modules/backend/user-request/types/types";

export const useGetUserRequestById = (id: string) => {
  const [userRequest, setUserRequest] = useState<UserRequest | null>(null);
  const [userRequestLoading, setUserRequestLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRequest = async () => {
      if (!id) {
        setUserRequestLoading(false);
        return;
      }

      try {
        setUserRequestLoading(true);
        const response = await fetch(`/api/backend/user-request/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch UserRequest with ID ${id}`);
        }

        const data = await response.json();
        setUserRequest(data);
      } catch (err) {
        console.error(`Error fetching UserRequest with ID ${id}:`, err);
      } finally {
        setUserRequestLoading(false);
      }
    };

    fetchUserRequest();
  }, [id]);

  return { userRequest, userRequestLoading };
};
