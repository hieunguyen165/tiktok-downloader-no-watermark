import { useEffect } from "react";

/**
 * Đọc cấu hình SEO admin từ localStorage và chèn động:
 * - Google Analytics 4 (gtag.js)
 * - Google Search Console <meta name="google-site-verification">
 * - <meta name="description"> ghi đè (nếu có)
 *
 * Lưu ý: vì lưu localStorage nên chỉ chạy phía client. GSC vẫn nhận
 * verification meta tag được render sau hydration trong nhiều trường hợp;
 * để chắc chắn hãy dùng phương án DNS hoặc đặt thẳng vào env.
 */
export function SeoInjector() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("videotik_seo_config");
      if (!raw) return;
      const cfg = JSON.parse(raw) as {
        gaId?: string;
        gscVerification?: string;
        siteDescription?: string;
        siteTitle?: string;
      };

      // Title override
      if (cfg.siteTitle && cfg.siteTitle.trim()) {
        document.title = cfg.siteTitle.trim();
      }

      // Description override
      if (cfg.siteDescription && cfg.siteDescription.trim()) {
        let m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!m) {
          m = document.createElement("meta");
          m.name = "description";
          document.head.appendChild(m);
        }
        m.content = cfg.siteDescription.trim();
      }

      // GSC verification meta
      if (cfg.gscVerification && cfg.gscVerification.trim()) {
        const v = cfg.gscVerification.trim();
        let m = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
        if (!m) {
          m = document.createElement("meta");
          m.name = "google-site-verification";
          document.head.appendChild(m);
        }
        m.content = v;
      }

      // Google Analytics
      const gaId = cfg.gaId?.trim();
      if (gaId && /^G-[A-Z0-9]+$/i.test(gaId)) {
        if (!document.querySelector(`script[data-ga="${gaId}"]`)) {
          const s1 = document.createElement("script");
          s1.async = true;
          s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          s1.dataset.ga = gaId;
          document.head.appendChild(s1);

          const s2 = document.createElement("script");
          s2.dataset.ga = `${gaId}-init`;
          s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
          document.head.appendChild(s2);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}
