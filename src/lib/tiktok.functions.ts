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
  provider: "tikwm" | "ssstik" | "tikmate";
};

class QuotaError extends Error {}

async function fromTikwm(url: string, source: "tiktok" | "douyin"): Promise<VideoInfo> {
  const res = await fetch("https://www.tikwm.com/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ url, hd: "1" }).toString(),
  });

  if (!res.ok) throw new Error(`TikWM HTTP ${res.status}`);

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
    const msg = (json.msg || "").toLowerCase();
    if (msg.includes("limit") || msg.includes("quota") || msg.includes("rate")) {
      throw new QuotaError(json.msg || "TikWM quota");
    }
    throw new Error(json.msg || "TikWM lỗi");
  }

  const d = json.data;
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
    provider: "tikwm",
  };
}

async function fromSsstik(url: string, source: "tiktok" | "douyin"): Promise<VideoInfo> {
  // Lấy token tt từ trang chủ
  const home = await fetch("https://ssstik.io/en", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    },
  });
  const homeHtml = await home.text();
  const ttMatch = homeHtml.match(/tt:\s*"([^"]+)"/);
  if (!ttMatch) throw new Error("Ssstik: không lấy được token");

  const res = await fetch("https://ssstik.io/abyss.php?lang=en", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      "HX-Request": "true",
      Origin: "https://ssstik.io",
      Referer: "https://ssstik.io/en",
    },
    body: new URLSearchParams({ id: url, locale: "en", tt: ttMatch[1] }).toString(),
  });

  if (!res.ok) throw new Error(`Ssstik HTTP ${res.status}`);
  const html = await res.text();

  const linkMatch = html.match(/href="(https:\/\/[^"]*tikcdn[^"]+)"/i)
    || html.match(/href="(https:\/\/tikcdn[^"]+)"/i)
    || html.match(/href="(https:\/\/[^"]+)"\s+[^>]*class="[^"]*without_watermark/i);
  if (!linkMatch) throw new Error("Ssstik: không tìm được link tải");

  const decode = (s: string) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  const videoUrl = decode(linkMatch[1]);

  const musicMatch = html.match(/href="(https:\/\/[^"]+)"[^>]*class="[^"]*music/i);
  const coverMatch = html.match(/<img[^>]+src="(https:\/\/[^"]+)"[^>]*class="result_author/i)
    || html.match(/<img[^>]+class="result_author[^"]*"[^>]+src="(https:\/\/[^"]+)"/i);
  const titleMatch = html.match(/<p class="maintext">([\s\S]*?)<\/p>/i);
  const authorMatch = html.match(/<h2>([\s\S]*?)<\/h2>/i);

  return {
    id: String(Date.now()),
    title: titleMatch ? decode(titleMatch[1].replace(/<[^>]+>/g, "")).trim() : "",
    author: authorMatch ? decode(authorMatch[1].replace(/<[^>]+>/g, "")).trim() : "",
    authorAvatar: null,
    cover: coverMatch ? decode(coverMatch[1]) : "",
    duration: 0,
    videoUrl,
    videoUrlHd: null,
    musicUrl: musicMatch ? decode(musicMatch[1]) : null,
    source,
    provider: "ssstik",
  };
}

export const fetchVideo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<VideoInfo> => {
    const host = new URL(data.url).hostname.toLowerCase();
    const source: "tiktok" | "douyin" = host.includes("douyin") ? "douyin" : "tiktok";

    const errors: string[] = [];

    // 1) TikWM (primary)
    try {
      return await fromTikwm(data.url, source);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`TikWM: ${msg}`);
      console.warn("[fetchVideo] TikWM failed:", msg);
    }

    // 2) Ssstik (fallback, chỉ tốt cho TikTok)
    if (source === "tiktok") {
      try {
        return await fromSsstik(data.url, source);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Ssstik: ${msg}`);
        console.warn("[fetchVideo] Ssstik failed:", msg);
      }
    }

    throw new Error(
      `Tất cả nhà cung cấp đều thất bại. Vui lòng thử lại sau.\n${errors.join(" | ")}`,
    );
  });
