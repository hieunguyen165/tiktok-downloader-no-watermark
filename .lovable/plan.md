# Website tải video TikTok / Douyin không watermark

## Mục tiêu
Một trang web đơn giản: người dùng dán link TikTok hoặc Douyin → bấm nút → nhận video MP4 không logo để tải xuống.

## Trải nghiệm người dùng
- Trang chủ tối giản, hero lớn với:
  - Tiêu đề + mô tả ngắn (hỗ trợ TikTok & Douyin, không watermark, miễn phí).
  - Ô input dán link + nút "Tải video".
  - Trạng thái: đang xử lý / lỗi / kết quả.
- Khu vực kết quả:
  - Thumbnail, tiêu đề, tác giả, thời lượng.
  - Nút "Tải MP4 không logo" (và tuỳ chọn "Tải MP3" nếu API hỗ trợ).
  - Nút copy link & dán lại.
- Phần "Cách dùng" 3 bước + FAQ ngắn (hợp pháp, chỉ tải nội dung công khai, tôn trọng bản quyền).
- Responsive, dark mode mặc định, hỗ trợ tiếng Việt.

## Kiến trúc kỹ thuật
- TanStack Start (đã có sẵn).
- Frontend: `src/routes/index.tsx` cho trang tải, component form + kết quả trong `src/components/`.
- Backend: server function `src/lib/tiktok.functions.ts`:
  - Input: URL (validate bằng zod, chỉ chấp nhận host tiktok.com / vm.tiktok.com / douyin.com / v.douyin.com).
  - Gọi API bên thứ 3 để lấy link video không watermark (TikWM `https://www.tikwm.com/api/` là lựa chọn mặc định — miễn phí, hỗ trợ cả Douyin, trả về `play` = link không logo).
  - Trả về: `{ title, author, cover, duration, videoUrl, musicUrl }`.
- Tải file: route server `src/routes/api/download.ts` proxy stream video về client với header `Content-Disposition: attachment` để tránh CORS và đảm bảo trình duyệt tải xuống thay vì mở.
- Không cần database, không cần auth, không cần Lovable Cloud.

## Thiết kế
Tối giản, hiện đại kiểu công cụ (giống snaptik / ssstik nhưng sạch hơn):
- Nền tối, accent hồng/cyan gợi nhớ TikTok.
- Typography: heading sans-serif đậm, body gọn.
- Bo góc lớn, shadow nhẹ trên card kết quả.

## Lưu ý pháp lý
Thêm dòng disclaimer nhỏ: chỉ dùng cho mục đích cá nhân, tôn trọng bản quyền tác giả.

## Bước triển khai
1. Tạo server function gọi TikWM + validate URL.
2. Tạo route `/api/download` để proxy stream MP4.
3. Xây UI: form, loading, kết quả, FAQ.
4. Thêm meta SEO (title, description tiếng Việt).
