import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/huong-dan")({
  head: () => ({
    meta: [
      { title: "Hướng Dẫn Tải Video TikTok Không Logo Trên Mọi Thiết Bị - VideoTik" },
      {
        name: "description",
        content:
          "Hướng dẫn chi tiết cách tải video TikTok không watermark trên iPhone, Android, máy tính. Hỗ trợ tải video Douyin, tải nhạc TikTok MP3 chất lượng HD 1080p miễn phí.",
      },
      {
        name: "keywords",
        content:
          "hướng dẫn tải video tiktok, tải tiktok không logo, tải video tiktok trên iphone, tải video tiktok trên android, tải video tiktok về máy tính, tải video douyin, tải nhạc tiktok mp3",
      },
      { property: "og:title", content: "Hướng Dẫn Tải Video TikTok Không Logo - VideoTik" },
      {
        property: "og:description",
        content:
          "Cách tải video TikTok / Douyin không watermark trên iPhone, Android, PC bằng VideoTik – nhanh, miễn phí.",
      },
      { property: "og:url", content: "/huong-dan" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/huong-dan" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cách tải video TikTok không logo bằng VideoTik",
          description:
            "Quy trình 3 bước để tải video TikTok hoặc Douyin chất lượng HD, không watermark.",
          step: [
            { "@type": "HowToStep", name: "Sao chép link video TikTok", text: "Mở app TikTok hoặc Douyin, bấm Chia sẻ và chọn Sao chép liên kết." },
            { "@type": "HowToStep", name: "Dán link vào VideoTik", text: "Mở videotik (trang chủ), dán liên kết vào ô nhập." },
            { "@type": "HowToStep", name: "Tải video MP4 HD", text: "Bấm nút Tải video, chọn chất lượng HD 1080p hoặc tải nhạc MP3." },
          ],
        }),
      },
    ],
  }),
  component: HuongDanPage,
});

function HuongDanPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        Hướng dẫn tải video TikTok không logo trên mọi thiết bị
      </h1>
      <p className="mt-4 text-muted-foreground">
        VideoTik là công cụ <strong>tải video TikTok không watermark</strong> miễn phí, hoạt động trực tiếp trên trình duyệt – không cần cài app, không quảng cáo, không yêu cầu đăng nhập tài khoản TikTok. Bài hướng dẫn này sẽ trình bày chi tiết từ việc sao chép liên kết đến lúc lưu file MP4 / MP3 về thiết bị, áp dụng cho cả iPhone, Android, Windows, macOS và cả TikTok Trung Quốc (Douyin).
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">1. Cách lấy link video TikTok</h2>
        <p>
          Để <strong>tải video TikTok</strong> bạn cần liên kết chia sẻ của video. Mở ứng dụng TikTok, vào video muốn tải, bấm vào nút mũi tên (Chia sẻ) ở góc phải, chọn <em>Sao chép liên kết</em>. Liên kết thường có dạng <code>https://www.tiktok.com/@username/video/123…</code> hoặc rút gọn <code>https://vt.tiktok.com/ABC123/</code>. Cả hai dạng đều dùng được với VideoTik.
        </p>
        <p>
          Với <strong>Douyin</strong> – phiên bản TikTok dành cho thị trường Trung Quốc – bạn cũng làm tương tự: bấm 分享 (Chia sẻ) → 复制链接 (Sao chép liên kết). VideoTik tự nhận diện được cả hai nguồn.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">2. Tải video TikTok không logo trên iPhone (iOS)</h2>
        <p>
          Trên iPhone, sau khi sao chép link, mở Safari hoặc Chrome, vào trang chủ <Link to="/" className="underline">videotik</Link>, dán link vào ô tìm kiếm và bấm <strong>Tải video</strong>. Video không watermark sẽ xuất hiện kèm các tuỳ chọn chất lượng (SD, HD, 1080p, MP3). Bấm nút <strong>HD</strong> để mở video, sau đó nhấn giữ và chọn <em>Tải xuống</em> – file MP4 sẽ lưu vào ứng dụng <em>Tệp</em>. Để chuyển vào <em>Ảnh</em>, mở Tệp → bấm và chọn <em>Lưu video</em>.
        </p>
        <p>
          Cách này không cần cài app tải TikTok bên thứ ba, không bị giới hạn lượt tải, không cần ID Apple ngoài Việt Nam và an toàn vì xử lý hoàn toàn trên trình duyệt của bạn.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">3. Tải video TikTok trên điện thoại Android</h2>
        <p>
          Quy trình trên Android tương tự iPhone: dán link vào trang chủ, chọn chất lượng, bấm tải. File MP4 sẽ vào thư mục <em>Download</em>. Một số máy Samsung / Xiaomi / Oppo sẽ hỏi quyền lưu trữ – bạn cứ cho phép. Nếu video không phát được, mở bằng VLC hoặc Google Files để xác nhận file đã tải đầy đủ.
        </p>
        <p>
          Mẹo: bạn có thể thêm <Link to="/" className="underline">videotik</Link> vào màn hình chính (Add to Home screen) như một PWA để mở nhanh khi cần <strong>tải video TikTok không watermark</strong>.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">4. Tải video TikTok về máy tính (Windows / macOS)</h2>
        <p>
          Trên máy tính, sao chép link từ tab TikTok web, dán vào VideoTik và chọn chất lượng. Trình duyệt sẽ tự động lưu file MP4 vào thư mục <em>Downloads</em>. Bạn có thể dùng các trình duyệt Chrome, Edge, Firefox, Brave, Safari đều được. Đây là phương pháp <strong>tải video TikTok HD</strong> ổn định nhất vì máy tính ít bị giới hạn dung lượng tải về.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">5. Tải nhạc nền TikTok dạng MP3</h2>
        <p>
          Sau khi VideoTik xử lý link, ngoài các nút chất lượng video, bạn sẽ thấy nút <strong>MP3</strong>. Bấm để tải file âm thanh gốc – rất hữu ích cho các creator muốn dựng lại video, làm nhạc chuông, hoặc lưu lại bản nhạc đang trending. File MP3 đầu ra giữ nguyên chất lượng âm thanh từ TikTok, không nén lại.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">6. Lý do nên dùng VideoTik thay vì các app tải video TikTok khác</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Không watermark, không logo TikTok</strong> – video sạch để dùng cho mục đích cá nhân, lưu trữ, học hỏi.</li>
          <li><strong>Không cần cài app</strong>, không chiếm dung lượng máy, không yêu cầu quyền truy cập danh bạ.</li>
          <li><strong>Hỗ trợ nhiều chất lượng</strong>: SD, HD 720p, Full HD 1080p và MP3.</li>
          <li><strong>Hỗ trợ Douyin</strong> – tiện cho người học tiếng Trung hoặc theo dõi xu hướng từ Trung Quốc.</li>
          <li><strong>Miễn phí 100%</strong>, không giới hạn số lượt tải mỗi ngày.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">7. Khắc phục lỗi thường gặp khi tải video TikTok</h2>
        <p>
          Nếu link không xử lý được, hãy kiểm tra: video có ở chế độ riêng tư không (chỉ tải được video công khai); link đã đầy đủ chưa (không bị cắt); thử mở link bằng trình duyệt – nếu trình duyệt cũng không xem được thì video đã bị xoá. Trường hợp gặp thông báo "tất cả nhà cung cấp đều thất bại", bạn chờ vài giây rồi thử lại – server backup của VideoTik thường khôi phục rất nhanh.
        </p>
      </section>

      <p className="mt-12 rounded-xl border border-border bg-card/40 p-5 text-sm text-muted-foreground">
        Cần thêm thông tin? Xem mục <Link to="/cau-hoi" className="font-medium text-foreground underline">Câu hỏi thường gặp</Link> hoặc đọc <Link to="/blog" className="font-medium text-foreground underline">Blog</Link> để cập nhật mẹo TikTok mới nhất.
      </p>
    </main>
  );
}
