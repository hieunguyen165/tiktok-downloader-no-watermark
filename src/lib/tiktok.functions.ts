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
    }, "Chỉ hỗ trợ link TikTok hoặc Douyin")
    .refine((u) => {
      try {
        const { hostname, pathname } = new URL(u);
        const host = hostname.toLowerCase();
        // Link rút gọn: vm./vt./v. — chỉ cần có path
        if (/^(vm|vt|v|m)\./.test(host)) return pathname.length > 1;
        // Link đầy đủ: phải có /video/<id>, /v/<id>, hoặc /@user/video/<id>
        return /\/(video|v|share\/video)\/\d+/.test(pathname)
          || /\/@[^/]+\/video\/\d+/.test(pathname);
      } catch {
        return false;
      }
    }, "Link phải trỏ tới một video cụ thể (vd: tiktok.com/@user/video/123...)"),
});

const rawInputSchema = z.object({
  url: z.string().trim().min(1, "Vui lòng nhập link").max(500, "Link quá dài"),
});

export type DownloadQuality = {
  label: string;
  quality: "hd" | "sd" | "watermark" | "audio";
  url: string;
  ext: "mp4" | "mp3";
  note?: string;
};

export type VideoInfo = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string | null;
  cover: string;
  duration: number;
  downloads: DownloadQuality[];
  source: "tiktok" | "douyin";
  provider: "tikwm" | "ssstik" | "tikmate";
};

export type FetchVideoResult =
  | { ok: true; video: VideoInfo }
  | { ok: false; error: string; details?: string[] };

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

  const downloads: DownloadQuality[] = [];
  if (d.hdplay) {
    downloads.push({ label: "HD không logo", quality: "hd", url: toAbs(d.hdplay), ext: "mp4", note: "Chất lượng cao nhất" });
  }
  if (d.play) {
    downloads.push({ label: "SD không logo", quality: "sd", url: toAbs(d.play), ext: "mp4", note: "Nhẹ, tải nhanh" });
  }
  if (d.wmplay) {
    downloads.push({ label: "Có watermark", quality: "watermark", url: toAbs(d.wmplay), ext: "mp4", note: "Giữ logo gốc" });
  }
  if (d.music) {
    downloads.push({ label: "Chỉ âm thanh (MP3)", quality: "audio", url: toAbs(d.music), ext: "mp3" });
  }

  return {
    id: d.id,
    title: d.title,
    author: d.author?.nickname || d.author?.unique_id || "",
    authorAvatar: d.author?.avatar ? toAbs(d.author.avatar) : null,
    cover: toAbs(d.origin_cover || d.cover),
    duration: d.duration,
    downloads,
    source,
    provider: "tikwm",
  };
}

async function fromSsstik(url: string, source: "tiktok" | "douyin"): Promise<VideoInfo> {
  const homeUrl = "https://ssstik.io/en";
  const browserHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  };

  const home = await fetch(homeUrl, {
    headers: {
      ...browserHeaders,
    },
  });
  const homeHtml = await home.text();

  const endpointMatch = homeHtml.match(/hx-post="([^"]+)"/i);
  const ttMatch = homeHtml.match(/s_tt\s*=\s*['"]([^'"]+)['"]/i)
    || homeHtml.match(/tt:\s*"([^"]+)"/i)
    || homeHtml.match(/&quot;tt&quot;:&quot;([^&]+)&quot;/i);
  if (!endpointMatch) throw new Error("Ssstik: không lấy được endpoint");
  if (!ttMatch) throw new Error("Ssstik: không lấy được token");

  const endpoint = new URL(endpointMatch[1].replace(/&amp;/g, "&"), homeUrl).toString();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...browserHeaders,
      "HX-Request": "true",
      "HX-Target": "target",
      "HX-Current-URL": homeUrl,
      Origin: "https://ssstik.io",
      Referer: homeUrl,
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
  .inputValidator((input: unknown) => rawInputSchema.parse(input))
  .handler(async ({ data }): Promise<FetchVideoResult> => {
    const parsedInput = inputSchema.safeParse(data);
    if (!parsedInput.success) {
      return { ok: false, error: parsedInput.error.issues[0]?.message || "Link không hợp lệ" };
    }

    const { url } = parsedInput.data;
    const host = new URL(data.url).hostname.toLowerCase();
    const source: "tiktok" | "douyin" = host.includes("douyin") ? "douyin" : "tiktok";

    const errors: string[] = [];

    // 1) TikWM (primary)
    try {
      return { ok: true, video: await fromTikwm(url, source) };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`TikWM: ${msg}`);
      console.warn("[fetchVideo] TikWM failed:", msg);
    }

    // 2) Ssstik (fallback, chỉ tốt cho TikTok)
    if (source === "tiktok") {
      try {
        return { ok: true, video: await fromSsstik(url, source) };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Ssstik: ${msg}`);
        console.warn("[fetchVideo] Ssstik failed:", msg);
      }
    }

    return {
      ok: false,
      error: "Không thể lấy video từ các nguồn hiện tại. Vui lòng thử lại sau hoặc dùng link TikTok đầy đủ.",
      details: errors,
    };
  });
