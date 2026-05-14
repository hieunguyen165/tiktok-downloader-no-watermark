import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { verifyAdminPassword } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Save, LogOut, ShieldAlert, Activity, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Quản trị - VideoTik" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

interface SeoConfig {
  siteTitle?: string;
  siteDescription?: string;
  gaId?: string;
  gscVerification?: string;
}

const STORAGE_KEY = "videotik_seo_config";
const SESSION_KEY = "videotik_admin_session";

function AdminPage() {
  const verify = useServerFn(verifyAdminPassword);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "ok") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verify({ data: { password } });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, "ok");
        setAuthed(true);
        setPassword("");
        toast.success("Đăng nhập thành công");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return (
      <main className="container mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4">
        <Card className="w-full p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.25_350)] to-[oklch(0.65_0.2_200)]">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Đăng nhập quản trị</h1>
              <p className="text-xs text-muted-foreground">Cấu hình SEO VideoTik</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="pwd">Mật khẩu</Label>
              <Input
                id="pwd"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu admin"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !password} className="w-full">
              {loading ? "Đang kiểm tra..." : "Đăng nhập"}
            </Button>
          </form>
          <p className="mt-6 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
            Mật khẩu được đối chiếu phía server với biến môi trường <code>ADMIN_PASSWORD</code>.
          </p>
          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">
            ← Quay về trang chủ
          </Link>
        </Card>
      </main>
    );
  }

  return <AdminDashboard onLogout={logout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [cfg, setCfg] = useState<SeoConfig>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCfg(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    toast.success("Đã lưu cấu hình. Tải lại trang để áp dụng.");
  };

  const update = (k: keyof SeoConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCfg((c) => ({ ...c, [k]: e.target.value }));

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển SEO</h1>
          <p className="text-sm text-muted-foreground">Cấu hình meta, Analytics và Search Console.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Xem site
          </Link>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-1 text-base font-semibold">Meta mặc định</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Ghi đè title và description hiển thị trên trình duyệt và mạng xã hội.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Site title</Label>
              <Input
                id="title"
                value={cfg.siteTitle || ""}
                onChange={update("siteTitle")}
                placeholder="VideoTik - Tải video TikTok không logo"
              />
            </div>
            <div>
              <Label htmlFor="desc">Meta description</Label>
              <Input
                id="desc"
                value={cfg.siteDescription || ""}
                onChange={update("siteDescription")}
                placeholder="Tải video TikTok, Douyin không watermark, miễn phí..."
                maxLength={160}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {(cfg.siteDescription || "").length}/160 ký tự
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[oklch(0.7_0.25_350)]" />
            <h2 className="text-base font-semibold">Google Analytics 4</h2>
          </div>
          <Label htmlFor="ga">Measurement ID</Label>
          <Input
            id="ga"
            value={cfg.gaId || ""}
            onChange={update("gaId")}
            placeholder="G-XXXXXXXXXX"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Lấy tại <a href="https://analytics.google.com/" target="_blank" rel="noreferrer" className="underline">analytics.google.com</a> → Admin → Data Streams. Khi nhập đúng định dạng <code>G-XXXX</code>, gtag.js được nạp tự động trên mọi trang.
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-[oklch(0.7_0.25_350)]" />
            <h2 className="text-base font-semibold">Google Search Console</h2>
          </div>
          <Label htmlFor="gsc">Mã xác minh (HTML tag)</Label>
          <Input
            id="gsc"
            value={cfg.gscVerification || ""}
            onChange={update("gscVerification")}
            placeholder="abcdef1234567890..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Trên <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="underline">Search Console</a>, chọn <em>Add property → URL prefix → HTML tag</em>. Sao chép <strong>chỉ giá trị bên trong content="…"</strong> và dán vào đây. Sau khi lưu, tải lại trang chủ rồi bấm <em>Verify</em>.
          </p>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            <Save className="mr-2 h-4 w-4" /> Lưu cấu hình
          </Button>
        </div>

        <p className="rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
          <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
          Cấu hình được lưu vào <code>localStorage</code> của trình duyệt và inject vào trang qua client-side. Phù hợp cho GA và GSC vì Googlebot biết render JavaScript. Nếu cần SSR cứng, hãy gắn các giá trị này thành biến môi trường khi build.
        </p>
      </form>
    </main>
  );
}
