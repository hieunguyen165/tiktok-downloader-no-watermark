import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { fetchVideo, type VideoInfo } from "@/lib/tiktok.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Link as LinkIcon, Loader2, Music, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaiTok — Tải video TikTok & Douyin không logo, miễn phí" },
      {
        name: "description",
        content:
          "Dán link TikTok hoặc Douyin để tải video MP4 chất lượng cao, không watermark. Miễn phí, không cần cài app.",
      },
      { property: "og:title", content: "TaiTok — Tải video TikTok & Douyin không logo" },
      {
        property: "og:description",
        content: "Tải video TikTok / Douyin không watermark, nhanh và miễn phí.",
      },
    ],
  }),
  component: Index,
});

function formatDuration(s: number) {
  if (!s || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Index() {
  const fetchVideoFn = useServerFn(fetchVideo);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setVideo(null);
    try {
      const result = await fetchVideoFn({ data: { url: url.trim() } });
      setVideo(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      toast.error("Không truy cập được clipboard");
    }
  };

  const downloadUrl = (target: string, filename: string) =>
    `/api/download?url=${encodeURIComponent(target)}&filename=${encodeURIComponent(filename)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[oklch(0.6_0.25_350)] opacity-20 blur-[120px]" />
        <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-[oklch(0.7_0.2_200)] opacity-15 blur-[100px]" />
      </div>

      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.25_350)] to-[oklch(0.65_0.2_200)]">
            <Download className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">TaiTok</span>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Tải video không watermark
        </span>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <section className="mx-auto max-w-3xl pt-12 text-center sm:pt-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.7_0.25_350)]" />
            <span className="text-muted-foreground">Miễn phí · Không cài app · Không logo</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Tải video{" "}
            <span className="bg-gradient-to-r from-[oklch(0.7_0.25_350)] to-[oklch(0.7_0.2_200)] bg-clip-text text-transparent">
              TikTok & Douyin
            </span>
            <br />
            không watermark
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Dán link video, bấm tải và lưu file MP4 chất lượng cao về máy. Không nhãn, không quảng cáo.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-[oklch(0.5_0.2_350)]/10 sm:flex-row"
          >
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Dán link TikTok hoặc Douyin tại đây..."
                className="h-12 border-0 bg-transparent pl-11 pr-20 text-base focus-visible:ring-0"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Dán
              </button>
            </div>
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              size="lg"
              className="h-12 bg-gradient-to-r from-[oklch(0.65_0.25_350)] to-[oklch(0.6_0.22_330)] px-8 text-base font-semibold text-white hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tải video
                </>
              )}
            </Button>
          </form>

          {video && (
            <Card className="mx-auto mt-8 max-w-2xl overflow-hidden border-border bg-card text-left">
              <div className="flex flex-col gap-5 p-5 sm:flex-row">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-muted sm:w-40 sm:flex-shrink-0">
                  {video.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.cover}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {formatDuration(video.duration)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                    {video.source}
                  </div>
                  <h3 className="text-base font-semibold leading-snug line-clamp-3">
                    {video.title || "Video"}
                  </h3>
                  {video.author && (
                    <p className="mt-1 text-sm text-muted-foreground">@{video.author}</p>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Button asChild className="bg-gradient-to-r from-[oklch(0.65_0.25_350)] to-[oklch(0.6_0.22_330)] text-white hover:opacity-90">
                      <a
                        href={downloadUrl(video.videoUrl, `${video.id}.mp4`)}
                        download
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Tải MP4
                      </a>
                    </Button>
                    {video.videoUrlHd && (
                      <Button asChild variant="secondary">
                        <a
                          href={downloadUrl(video.videoUrlHd, `${video.id}-hd.mp4`)}
                          download
                        >
                          <Download className="mr-2 h-4 w-4" />
                          HD
                        </a>
                      </Button>
                    )}
                    {video.musicUrl && (
                      <Button asChild variant="outline">
                        <a
                          href={downloadUrl(video.musicUrl, `${video.id}.mp3`)}
                          download
                        >
                          <Music className="mr-2 h-4 w-4" />
                          MP3
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* Features */}
        <section className="mx-auto mt-24 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Không watermark", desc: "Video sạch, không có logo TikTok hay Douyin." },
            { icon: Zap, title: "Tải siêu nhanh", desc: "Xử lý trong vài giây, hỗ trợ chất lượng HD." },
            { icon: Sparkles, title: "Hoàn toàn miễn phí", desc: "Không cần đăng ký, không giới hạn lượt tải." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border bg-card/50 p-5 backdrop-blur">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.7_0.25_350)]/20 to-[oklch(0.65_0.2_200)]/20">
                <Icon className="h-5 w-5 text-[oklch(0.7_0.25_350)]" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </section>

        {/* How to use */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Cách sử dụng</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Sao chép link", desc: "Mở app TikTok hoặc Douyin, bấm Chia sẻ → Sao chép liên kết." },
              { step: "2", title: "Dán vào ô", desc: "Quay lại đây và dán link vào ô tìm kiếm phía trên." },
              { step: "3", title: "Tải xuống", desc: "Bấm nút Tải video và lưu file MP4 về thiết bị của bạn." },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-card/30 p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_350)] to-[oklch(0.6_0.22_330)] text-sm font-bold text-white">
                  {s.step}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-16 max-w-2xl text-center text-xs text-muted-foreground">
          TaiTok chỉ phục vụ mục đích cá nhân. Vui lòng tôn trọng bản quyền của tác giả gốc và
          không sử dụng nội dung tải xuống cho mục đích thương mại khi chưa được phép.
        </p>
      </main>
    </div>
  );
}
