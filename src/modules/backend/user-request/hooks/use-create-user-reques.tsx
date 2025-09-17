import { useState } from "react";
import { UserRequest } from "@/modules/backend/user-request/types/types";

interface CreateUserRequestData {
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  hospital: string;
  designation: string;
  message: string;
}

export const useCreateUserRequest = () => {
  const [userRequest, setUserRequest] = useState<UserRequest | null>(null);
  const [userRequestLoading, setUserRequestLoading] = useState<boolean>(false);

  const createUserRequest = async (data: CreateUserRequestData) => {
    try {
      setUserRequestLoading(true);
      const response = await fetch("/api/backend/user-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create UserRequest");
      }

      const createdSbu = await response.json();
      setUserRequest(createdSbu);
      return createdSbu;
    } catch (err) {
      console.error("Error creating UserRequest:", err);
      return null;
    } finally {
      setUserRequestLoading(false);
    }
  };

  return { createUserRequest, userRequest, userRequestLoading };
};
