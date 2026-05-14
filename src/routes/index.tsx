import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { fetchVideo, type VideoInfo } from "@/lib/tiktok.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Download,
  Link as LinkIcon,
  Loader2,
  Music,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tải Video TikTok Không Logo - Tải TikTok MP4, MP3 Miễn Phí" },
      {
        name: "description",
        content:
          "Tải video TikTok không logo, không watermark chất lượng HD/1080p. Hỗ trợ tải video Douyin, tải nhạc TikTok MP3 miễn phí, nhanh, không cần cài app.",
      },
      {
        name: "keywords",
        content:
          "tải video tiktok, tải video tiktok không logo, tải tiktok không watermark, tải video douyin, tải nhạc tiktok mp3, tải tiktok hd, download tiktok",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Tải Video TikTok Không Logo - MP4 HD Miễn Phí" },
      {
        property: "og:description",
        content:
          "Dán link để tải video TikTok / Douyin không watermark, chất lượng HD 1080p, kèm tải nhạc MP3. Miễn phí 100%.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "vi_VN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tải Video TikTok Không Logo - MP4 HD Miễn Phí" },
      {
        name: "twitter:description",
        content: "Tải video TikTok, Douyin không watermark chất lượng HD. Miễn phí, nhanh chóng.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "VideoTik",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          description:
            "Công cụ tải video TikTok và Douyin không watermark, hỗ trợ MP4 HD 1080p và MP3.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Làm sao để tải video TikTok không logo?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sao chép link video từ app TikTok, dán vào ô nhập trên trang và bấm Tải video. Hệ thống sẽ trả về file MP4 không watermark.",
              },
            },
            {
              "@type": "Question",
              name: "Tải video TikTok có miễn phí không?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Có. VideoTik miễn phí 100%, không giới hạn lượt tải, không cần đăng ký hay cài đặt phần mềm.",
              },
            },
            {
              "@type": "Question",
              name: "Có thể tải nhạc MP3 từ TikTok không?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Có. Sau khi xử lý link, bạn có thể chọn tải file MP3 chứa âm thanh gốc của video.",
              },
            },
            {
              "@type": "Question",
              name: "Chất lượng video tải xuống tối đa là bao nhiêu?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tối đa 1080p (Full HD) – đúng bằng chất lượng gốc mà TikTok và Douyin phát hành.",
              },
            },
          ],
        }),
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
      if (result.ok) {
        setVideo(result.video);
      } else {
        toast.error(result.error, {
          description: result.details?.join(" | "),
        });
      }
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
    <main className="container mx-auto px-4 pb-20">
      <section className="mx-auto max-w-3xl pt-12 text-center sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[oklch(0.7_0.25_350)]" />
          <span className="text-muted-foreground">Miễn phí · Không cài app · Không logo</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Tải video{" "}
          <span className="bg-gradient-to-r from-[oklch(0.7_0.25_350)] to-[oklch(0.7_0.2_200)] bg-clip-text text-transparent">
            TikTok
          </span>{" "}
          không logo
          <br />
          <span className="text-3xl sm:text-4xl">MP4 HD · MP3 · Douyin</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Dán link để tải video TikTok / Douyin không watermark chất lượng Full HD 1080p, kèm tải
          nhạc MP3. Miễn phí, không cần cài app.
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
                  <img src={video.cover} alt={video.title} className="h-full w-full object-cover" />
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

                <div className="mt-auto space-y-3 pt-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Chọn chất lượng tải xuống:
                  </p>

                  {/* Thang chất lượng video */}
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {(
                      [
                        { tier: "sd", label: "SD", sub: "≈480p" },
                        { tier: "hd", label: "HD", sub: "≈720p" },
                        { tier: "fhd", label: "1080p", sub: "Full HD" },
                        { tier: "qhd", label: "2K", sub: "1440p" },
                        { tier: "uhd", label: "4K", sub: "2160p" },
                        { tier: "8k", label: "8K", sub: "4320p" },
                      ] as const
                    ).map(({ tier, label, sub }) => {
                      // map tier sang download có sẵn
                      let dl = video.downloads.find((d) => d.quality === tier);
                      // fallback: 1080p dùng file HD nếu provider không phân biệt
                      if (!dl && tier === "fhd") {
                        dl = video.downloads.find((d) => d.quality === "hd");
                      }
                      const available = !!dl;
                      const filename = dl ? `${video.id}-${tier}.${dl.ext}` : `${video.id}.mp4`;
                      return (
                        <Button
                          key={tier}
                          asChild={available}
                          disabled={!available}
                          variant={tier === "fhd" && available ? "default" : "secondary"}
                          size="sm"
                          className={
                            tier === "fhd" && available
                              ? "h-auto flex-col gap-0 py-2 bg-gradient-to-r from-[oklch(0.65_0.25_350)] to-[oklch(0.6_0.22_330)] text-white hover:opacity-90"
                              : "h-auto flex-col gap-0 py-2"
                          }
                          title={
                            available
                              ? `Tải ${label}`
                              : "Nguồn TikTok/Douyin không cung cấp chất lượng này"
                          }
                        >
                          {available && dl ? (
                            <a href={downloadUrl(dl.url, filename)} download>
                              <span className="text-sm font-semibold leading-none">{label}</span>
                              <span className="mt-1 text-[10px] opacity-80">{sub}</span>
                            </a>
                          ) : (
                            <>
                              <span className="text-sm font-semibold leading-none">{label}</span>
                              <span className="mt-1 text-[10px] opacity-60">N/A</span>
                            </>
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Tuỳ chọn khác: watermark + audio */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {video.downloads
                      .filter((d) => d.quality === "watermark" || d.quality === "audio")
                      .map((d, i) => {
                        const isAudio = d.quality === "audio";
                        const filename = `${video.id}${isAudio ? "" : "-wm"}.${d.ext}`;
                        return (
                          <Button key={`extra-${i}`} asChild variant="outline" size="sm">
                            <a href={downloadUrl(d.url, filename)} download title={d.note}>
                              {isAudio ? (
                                <Music className="mr-2 h-4 w-4" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              {d.label}
                            </a>
                          </Button>
                        );
                      })}
                  </div>

                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Lưu ý: TikTok/Douyin chỉ phát hành video tối đa <b>1080p</b>. Các tuỳ chọn
                    2K/4K/8K sẽ bị mờ vì nguồn gốc không có — không thể tạo độ phân giải cao hơn
                    nguồn thật.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto mt-24 grid max-w-4xl gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Không watermark",
            desc: "Video sạch, không có logo TikTok hay Douyin.",
          },
          {
            icon: Zap,
            title: "Tải siêu nhanh",
            desc: "Xử lý trong vài giây, hỗ trợ chất lượng HD.",
          },
          {
            icon: Sparkles,
            title: "Hoàn toàn miễn phí",
            desc: "Không cần đăng ký, không giới hạn lượt tải.",
          },
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
            {
              step: "1",
              title: "Sao chép link",
              desc: "Mở app TikTok hoặc Douyin, bấm Chia sẻ → Sao chép liên kết.",
            },
            {
              step: "2",
              title: "Dán vào ô",
              desc: "Quay lại đây và dán link vào ô tìm kiếm phía trên.",
            },
            {
              step: "3",
              title: "Tải xuống",
              desc: "Bấm nút Tải video và lưu file MP4 về thiết bị của bạn.",
            },
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

      {/* FAQ */}
      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Câu hỏi thường gặp về tải video TikTok
        </h2>
        <div className="mt-8 space-y-3">
          {[
            {
              q: "Làm sao để tải video TikTok không logo?",
              a: "Sao chép link video từ app TikTok (Chia sẻ → Sao chép liên kết), dán vào ô phía trên và bấm Tải video. Hệ thống trả về file MP4 không watermark.",
            },
            {
              q: "Tải video TikTok trên VideoTik có miễn phí không?",
              a: "Hoàn toàn miễn phí, không giới hạn lượt tải, không cần đăng ký tài khoản hay cài đặt phần mềm.",
            },
            {
              q: "Có thể tải nhạc MP3 từ video TikTok không?",
              a: "Có. Sau khi xử lý, bạn có thể chọn tải file MP3 chứa âm thanh gốc của video TikTok.",
            },
            {
              q: "Chất lượng video TikTok tải xuống tối đa bao nhiêu?",
              a: "Tối đa 1080p (Full HD) – đúng bằng chất lượng gốc TikTok và Douyin phát hành. Các tuỳ chọn 2K/4K/8K không khả dụng vì nguồn thật không có.",
            },
            {
              q: "VideoTik có hỗ trợ tải video Douyin không?",
              a: "Có. Công cụ hỗ trợ cả link TikTok quốc tế và Douyin (TikTok Trung Quốc).",
            },
          ].map((item) => (
            <details key={item.q} className="group rounded-xl border border-border bg-card/30 p-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="text-[oklch(0.7_0.25_350)]">+ </span>
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mx-auto mt-16 max-w-2xl text-center text-xs text-muted-foreground">
        VideoTik chỉ phục vụ mục đích cá nhân. Vui lòng tôn trọng bản quyền của tác giả gốc và không
        sử dụng nội dung tải xuống cho mục đích thương mại khi chưa được phép.
      </p>
    </main>
  );
}
