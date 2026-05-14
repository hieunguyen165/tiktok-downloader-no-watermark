import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_HOST_SUFFIXES = ["tikwm.com", "tiktokcdn.com", "tiktokcdn-us.com", "douyinpic.com", "douyinvod.com", "bytecdn.cn", "byteimg.com"];

export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const target = url.searchParams.get("url");
        const filename = url.searchParams.get("filename") || "video.mp4";

        if (!target) {
          return new Response("Missing url", { status: 400 });
        }

        let parsed: URL;
        try {
          parsed = new URL(target);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }

        const host = parsed.hostname.toLowerCase();
        if (!ALLOWED_HOST_SUFFIXES.some((s) => host === s || host.endsWith("." + s))) {
          return new Response("Host not allowed", { status: 403 });
        }

        const upstream = await fetch(parsed.toString(), {
          headers: { Referer: "https://www.tikwm.com/", "User-Agent": "Mozilla/5.0" },
        });

        if (!upstream.ok || !upstream.body) {
          return new Response("Upstream error", { status: 502 });
        }

        const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100) || "video.mp4";

        const headers = new Headers();
        headers.set("Content-Type", upstream.headers.get("Content-Type") || "video/mp4");
        const len = upstream.headers.get("Content-Length");
        if (len) headers.set("Content-Length", len);
        headers.set("Content-Disposition", `attachment; filename="${safeName}"`);
        headers.set("Cache-Control", "no-store");

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
