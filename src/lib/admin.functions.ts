import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Xác thực mật khẩu admin với biến môi trường ADMIN_PASSWORD.
 * Trả về token đơn giản nếu khớp. KHÔNG dùng cho hệ thống nghiêm ngặt.
 */
export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return {
        ok: false as const,
        error: "Chưa cấu hình ADMIN_PASSWORD. Hãy thêm biến môi trường này trong project secrets.",
      };
    }
    if (data.password !== expected) {
      return { ok: false as const, error: "Mật khẩu không đúng." };
    }
    return { ok: true as const, token: "admin-ok" };
  });
