"use client";

import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
