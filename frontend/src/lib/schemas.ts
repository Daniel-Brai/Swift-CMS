import { zfd } from "zod-form-data";
import { z } from "zod";

const userLoginSchema = z.object({
  email: zfd.text(z.string().email()),
  password: zfd.text(
    z.string().min(8, "Password must be at least 8 characters long")
  ),
});

const userRegisterSchema = userLoginSchema
  .extend({
    name: zfd.text(z.string().min(2, "Name must be at least 2 character long")),
    confirmPassword: zfd.text(
      z.string().min(8, "Password must be at least 8 characters long")
    ),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = zfd.formData(userLoginSchema);
export const registerSchema = zfd.formData(userRegisterSchema);
