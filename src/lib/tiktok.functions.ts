import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALLOWED_HOSTS = [
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
  "m.tiktok.com",
  "douyin.com",
  "www.douyin.com",
  "v.douyin.com",
  "iesdouyin.com",
  "www.iesdouyin.com",
];

const inputSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập link")
    .max(500, "Link quá dài")
    .url("Link không hợp lệ")
    .refine((u) => {
      try {
        const host = new URL(u).hostname.toLowerCase();
        return ALLOWED_HOSTS.some((h) => host === h || host.endsWith("." + h));
      } catch {
        return false;
      }
    }, "Chỉ hỗ trợ link TikTok hoặc Douyin"),
});

export type VideoInfo = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string | null;
  cover: string;
  duration: number;
  videoUrl: string;
  videoUrlHd: string | null;
  musicUrl: string | null;
  source: "tiktok" | "douyin";
};

export const fetchVideo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<VideoInfo> => {
    const res = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({ url: data.url, hd: "1" }).toString(),
    });

    if (!res.ok) {
      throw new Error(`Không thể lấy dữ liệu video (HTTP ${res.status})`);
    }

    const json = (await res.json()) as {
      code: number;
      msg?: string;
      data?: {
        id: string;
        title: string;
        cover: string;
        origin_cover?: string;
        duration: number;
        play: string;
        wmplay?: string;
        hdplay?: string;
        music: string;
        author: { unique_id: string; nickname: string; avatar: string };
      };
    };

    if (json.code !== 0 || !json.data) {
      throw new Error(json.msg || "Không lấy được video. Vui lòng kiểm tra lại link.");
    }

    const d = json.data;
    const host = new URL(data.url).hostname.toLowerCase();
    const source: "tiktok" | "douyin" = host.includes("douyin") ? "douyin" : "tiktok";
    const toAbs = (p: string) =>
      p.startsWith("http") ? p : `https://www.tikwm.com${p}`;

    return {
      id: d.id,
      title: d.title,
      author: d.author?.nickname || d.author?.unique_id || "",
      authorAvatar: d.author?.avatar ? toAbs(d.author.avatar) : null,
      cover: toAbs(d.origin_cover || d.cover),
      duration: d.duration,
      videoUrl: toAbs(d.play),
      videoUrlHd: d.hdplay ? toAbs(d.hdplay) : null,
      musicUrl: d.music ? toAbs(d.music) : null,
      source,
    };
  });
