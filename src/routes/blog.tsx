import { createFileRoute, Link } from "@tanstack/react-router";

const POSTS = [
  {
    slug: "meo-tang-luot-xem-tiktok",
    title: "10 mẹo tăng lượt xem TikTok cho creator Việt năm 2025",
    excerpt:
      "Bí quyết hook 3 giây đầu, chọn nhạc trending, hashtag và tần suất đăng giúp video TikTok của bạn lên xu hướng nhanh hơn.",
    body: "TikTok ngày càng cạnh tranh nhưng vẫn là nền tảng video ngắn dễ viral nhất. Để tăng lượt xem, hãy đầu tư vào hook 3 giây đầu, dùng nhạc đang trending (bạn có thể tải về từ VideoTik), thêm caption gợi mở thảo luận, đăng đều mỗi ngày 1–2 video vào khung giờ 19h–22h. Phân tích insight để biết video nào giữ chân người xem lâu nhất, từ đó nhân rộng công thức thành công.",
  },
  {
    slug: "tai-video-tiktok-khong-logo-an-toan",
    title: "Tải video TikTok không logo có an toàn? Cảnh báo các app giả",
    excerpt:
      "Hướng dẫn nhận biết app tải video TikTok lừa đảo và lý do nên dùng công cụ web như VideoTik thay vì cài app lạ.",
    body: "Nhiều ứng dụng 'tiktok downloader' trên CH Play và App Store yêu cầu quyền truy cập danh bạ, vị trí, thậm chí mật khẩu TikTok – đây là dấu hiệu rõ ràng của app giả. Một công cụ tải video TikTok hợp pháp chỉ cần link công khai, không cần đăng nhập. Sử dụng VideoTik trực tiếp trong trình duyệt là phương án an toàn nhất: không cài app, không lưu dữ liệu, không bị quảng cáo độc hại.",
  },
  {
    slug: "luu-nhac-tiktok-mp3-lam-nhac-chuong",
    title: "Cách lưu nhạc TikTok MP3 làm nhạc chuông iPhone & Android",
    excerpt:
      "Tải nhạc nền TikTok về dạng MP3 và đặt làm nhạc chuông cho điện thoại chỉ với vài bước đơn giản.",
    body: "Sau khi tải file MP3 từ VideoTik, trên iPhone bạn dùng GarageBand để cắt 30 giây và export làm Ringtone. Trên Android, copy file vào thư mục Ringtones rồi vào Cài đặt → Âm thanh → Nhạc chuông để chọn. Đây là cách nhanh nhất để biến mọi đoạn nhạc trending TikTok thành chuông điện thoại của riêng bạn.",
  },
  {
    slug: "su-khac-nhau-tiktok-douyin",
    title: "TikTok và Douyin khác nhau ra sao? Có nên xem cả hai?",
    excerpt:
      "Phân tích sự khác biệt về thuật toán, nội dung, định dạng video giữa TikTok quốc tế và Douyin (Trung Quốc).",
    body: "Cùng do ByteDance phát hành nhưng TikTok và Douyin chạy hai cơ sở hạ tầng khác nhau, có nội dung khác nhau và thậm chí thuật toán đề xuất khác nhau. Douyin cho phép video dài hơn (tối đa 30 phút), có chợ thương mại điện tử tích hợp sâu, và xu hướng mua hàng livestream phát triển mạnh hơn TikTok quốc tế. Bạn có thể tải video Douyin trực tiếp bằng VideoTik để học hỏi xu hướng trước khi nó lan ra TikTok toàn cầu.",
  },
  {
    slug: "kich-thuoc-video-tiktok-chuan",
    title: "Kích thước video TikTok chuẩn 2025: tỷ lệ, độ phân giải, dung lượng",
    excerpt:
      "Tổng hợp thông số kỹ thuật video TikTok mới nhất giúp bạn quay và edit chuẩn ngay từ đầu.",
    body: "Kích thước video TikTok chuẩn là 1080×1920px (tỷ lệ 9:16), tốc độ khung hình 30fps hoặc 60fps, dung lượng tối đa 287.6MB cho upload qua web. Định dạng khuyến nghị là MP4 hoặc MOV với codec H.264. Khi tải video TikTok bằng VideoTik, file gốc giữ nguyên 1080×1920 – tiện cho việc remix hoặc đăng lại sau khi xin phép tác giả.",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog VideoTik - Mẹo Tải & Sáng Tạo Video TikTok" },
      {
        name: "description",
        content:
          "Bài viết hướng dẫn tải video TikTok, mẹo viral, so sánh TikTok và Douyin, kỹ thuật làm video, chọn nhạc trending – cập nhật liên tục.",
      },
      {
        name: "keywords",
        content:
          "blog tiktok, mẹo tiktok, tải video tiktok, viral tiktok, douyin, sáng tạo video ngắn, kích thước video tiktok",
      },
      { property: "og:title", content: "Blog VideoTik - Mẹo Tải & Sáng Tạo Video TikTok" },
      {
        property: "og:description",
        content: "Kiến thức cập nhật cho người tải và sáng tạo video TikTok / Douyin.",
      },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog VideoTik",
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            url: `/blog#${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        Blog VideoTik – Mẹo tải và sáng tạo video TikTok
      </h1>
      <p className="mt-4 text-muted-foreground">
        Tập hợp các bài viết về <strong>tải video TikTok không watermark</strong>, kỹ thuật làm video viral, so sánh TikTok với Douyin, cách lưu và tận dụng nhạc TikTok cho mục đích cá nhân – cập nhật thường xuyên cho cộng đồng người dùng tiếng Việt.
      </p>

      <div className="mt-10 space-y-8">
        {POSTS.map((p) => (
          <article
            key={p.slug}
            id={p.slug}
            className="scroll-mt-24 rounded-2xl border border-border bg-card/40 p-6"
          >
            <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{p.title}</h2>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{p.excerpt}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">{p.body}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-medium text-[oklch(0.7_0.25_350)] hover:underline"
            >
              → Tải video TikTok ngay
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-12 rounded-xl border border-border bg-card/40 p-5 text-sm text-muted-foreground">
        Đọc thêm <Link to="/huong-dan" className="font-medium text-foreground underline">Hướng dẫn</Link> và <Link to="/cau-hoi" className="font-medium text-foreground underline">Câu hỏi thường gặp</Link> để khai thác tối đa VideoTik.
      </p>
    </main>
  );
}
