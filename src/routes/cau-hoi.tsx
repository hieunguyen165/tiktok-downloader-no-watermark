import { createFileRoute, Link } from "@tanstack/react-router";

const FAQS = [
  {
    q: "VideoTik có thực sự miễn phí khi tải video TikTok không?",
    a: "Có. VideoTik miễn phí 100%, không giới hạn lượt tải, không yêu cầu đăng ký tài khoản, không bắt xem quảng cáo bắt buộc. Toàn bộ chi phí vận hành do nhóm phát triển tự chi trả nhằm phục vụ cộng đồng người dùng tiếng Việt.",
  },
  {
    q: "Tải video TikTok không logo có vi phạm bản quyền không?",
    a: "Việc tải video về xem cá nhân thường không bị coi là vi phạm. Tuy nhiên nếu bạn đăng lại video của người khác (đặc biệt khi đã xoá watermark) lên kênh khác để kiếm tiền, đó là hành vi vi phạm bản quyền và điều khoản sử dụng của TikTok. Hãy luôn ghi rõ nguồn và xin phép tác giả gốc.",
  },
  {
    q: "Chất lượng video tải xuống có giảm so với bản gốc không?",
    a: "Không. VideoTik lấy thẳng file gốc mà TikTok / Douyin phát hành cho người xem, không nén lại. Chất lượng cao nhất hiện tại là 1080p (Full HD) – đúng như nguồn. Các tuỳ chọn 2K/4K/8K không khả dụng vì TikTok không phát hành ở các độ phân giải đó.",
  },
  {
    q: "Có thể tải video TikTok bị khoá riêng tư hoặc chỉ cho bạn bè không?",
    a: "Không. VideoTik chỉ tải được video công khai. Video riêng tư, video chỉ chia sẻ cho bạn bè hoặc video bị xoá sẽ không thể tải vì server không có quyền truy cập.",
  },
  {
    q: "Tại sao có khi tải video TikTok bị lỗi 'parse url'?",
    a: "Nguyên nhân thường là link bị thiếu hoặc dán nhầm phần khác. Hãy mở app TikTok, bấm Chia sẻ → Sao chép liên kết một lần nữa và thử lại. Nếu vẫn lỗi, có thể video đã bị tác giả gỡ.",
  },
  {
    q: "VideoTik có hỗ trợ tải video Douyin (TikTok Trung Quốc) không?",
    a: "Có. Bạn dán link Douyin (v.douyin.com hoặc www.douyin.com) như bình thường. Hệ thống nhận diện tự động và trả về file MP4 không watermark.",
  },
  {
    q: "Tôi có thể tải hàng loạt video TikTok một lúc không?",
    a: "Phiên bản miễn phí hiện hỗ trợ tải từng link một để đảm bảo tốc độ. Tính năng tải hàng loạt (batch download) đang trong kế hoạch phát triển.",
  },
  {
    q: "Có cần đăng nhập TikTok để tải video bằng VideoTik không?",
    a: "Không. VideoTik không yêu cầu bất kỳ thông tin đăng nhập nào của TikTok. Chúng tôi không bao giờ hỏi mật khẩu tài khoản TikTok của bạn – nếu trang nào yêu cầu điều đó, hãy cẩn thận vì có thể là lừa đảo.",
  },
  {
    q: "Tải video TikTok có lưu lịch sử trên VideoTik không?",
    a: "Không. Hệ thống không lưu lại link bạn dán hay video bạn tải về. Mọi thao tác diễn ra theo phiên và không gắn với bất kỳ tài khoản nào.",
  },
  {
    q: "Tôi có thể dùng VideoTik trên trình duyệt nào?",
    a: "Mọi trình duyệt hiện đại: Chrome, Edge, Firefox, Safari, Brave, Cốc Cốc, Opera, Samsung Internet đều dùng tốt trên cả desktop lẫn mobile.",
  },
  {
    q: "Vì sao có khi nút 2K, 4K, 8K bị mờ?",
    a: "Vì TikTok và Douyin không phát hành video ở 2K/4K/8K. Mọi công cụ quảng cáo 'tải TikTok 4K' đều phải nâng cấp giả (upscale), không phải chất lượng thật. VideoTik chọn cách trung thực hiển thị các mức không khả dụng để bạn không bị nhầm.",
  },
  {
    q: "Tôi có thể nhúng VideoTik vào website hay app của mình không?",
    a: "Hiện chưa có API công khai. Nếu bạn muốn tích hợp, hãy liên hệ qua trang Blog – đội ngũ sẽ phản hồi.",
  },
];

export const Route = createFileRoute("/cau-hoi")({
  head: () => ({
    meta: [
      { title: "Câu Hỏi Thường Gặp Khi Tải Video TikTok - VideoTik FAQ" },
      {
        name: "description",
        content:
          "Giải đáp tất cả thắc mắc về cách tải video TikTok không logo, chất lượng HD, MP3, Douyin, bản quyền và lỗi thường gặp. Cập nhật mới nhất từ VideoTik.",
      },
      {
        name: "keywords",
        content:
          "câu hỏi tải video tiktok, faq tiktok, tải tiktok không logo có vi phạm, tải tiktok bị lỗi, tải video douyin, tải nhạc tiktok",
      },
      { property: "og:title", content: "Câu Hỏi Thường Gặp Khi Tải Video TikTok - VideoTik" },
      {
        property: "og:description",
        content: "Mọi thắc mắc về tải video TikTok không watermark được giải đáp.",
      },
      { property: "og:url", content: "/cau-hoi" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/cau-hoi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: CauHoiPage,
});

function CauHoiPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        Câu hỏi thường gặp khi tải video TikTok
      </h1>
      <p className="mt-4 text-muted-foreground">
        Tổng hợp các thắc mắc phổ biến nhất của người dùng VideoTik về việc <strong>tải video TikTok không logo</strong>, <strong>tải nhạc TikTok MP3</strong>, vấn đề bản quyền và những lỗi hay gặp khi tải video Douyin.
      </p>

      <div className="mt-10 space-y-3">
        {FAQS.map((item, i) => (
          <details
            key={item.q}
            open={i < 2}
            className="group rounded-xl border border-border bg-card/40 p-5"
          >
            <summary className="cursor-pointer list-none font-semibold marker:hidden">
              <span className="text-[oklch(0.7_0.25_350)]">+ </span>
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-12 rounded-xl border border-border bg-card/40 p-5 text-sm text-muted-foreground">
        Chưa thấy câu trả lời bạn cần? Đọc thêm <Link to="/huong-dan" className="font-medium text-foreground underline">Hướng dẫn chi tiết</Link> hoặc bắt đầu <Link to="/" className="font-medium text-foreground underline">tải video ngay</Link>.
      </p>
    </main>
  );
}
