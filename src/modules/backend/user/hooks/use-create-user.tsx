import { useState } from "react";
import { User } from "@/modules/backend/user/types/types";

interface CreateUserData {
  id: string;
  email: string;
  hashedPassword: string;
  roleId: number;
}

export const useCreateUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const createUser = async (data: CreateUserData) => {
    try {
      setUserLoading(true);
      const response = await fetch("/api/backend/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create User");
      }

      const createdUser = await response.json();
      setUser(createdUser);
      return createdUser;
    } catch (err) {
      console.error("Error creating User:", err);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  return { createUser, user, userLoading };
};
