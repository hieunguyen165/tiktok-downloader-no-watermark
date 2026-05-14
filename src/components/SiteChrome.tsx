import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.25_350)] to-[oklch(0.65_0.2_200)]">
          <Download className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">VideoTik</span>
      </Link>
      <nav className="flex items-center gap-1 text-sm sm:gap-3">
        <Link
          to="/huong-dan"
          className="rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          activeProps={{ className: "rounded-md px-2 py-1 text-foreground font-medium" }}
        >
          Hướng dẫn
        </Link>
        <Link
          to="/cau-hoi"
          className="rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          activeProps={{ className: "rounded-md px-2 py-1 text-foreground font-medium" }}
        >
          Câu hỏi
        </Link>
        <Link
          to="/blog"
          className="rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          activeProps={{ className: "rounded-md px-2 py-1 text-foreground font-medium" }}
        >
          Blog
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-20">
      <div className="container mx-auto grid gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="text-base font-bold">VideoTik</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Công cụ tải video TikTok, Douyin không logo, miễn phí, hỗ trợ MP4 HD và MP3.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Sản phẩm</div>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Tải video TikTok</Link></li>
            <li><Link to="/huong-dan" className="hover:text-foreground">Hướng dẫn sử dụng</Link></li>
            <li><Link to="/cau-hoi" className="hover:text-foreground">Câu hỏi thường gặp</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog mẹo TikTok</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Đăng nhập quản trị</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Pháp lý</div>
          <p className="mt-2 text-xs text-muted-foreground">
            VideoTik chỉ hỗ trợ tải nội dung phục vụ mục đích cá nhân. Vui lòng tôn trọng bản quyền tác giả gốc và các điều khoản của TikTok / Douyin.
          </p>
        </div>
      </div>
      <div className="border-t border-border/30 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VideoTik. Không liên kết với TikTok hay ByteDance.
      </div>
    </footer>
  );
}
