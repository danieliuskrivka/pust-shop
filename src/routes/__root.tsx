import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ShopShell } from "@/components/shop-shell";
import appCss from "../styles.css?url";

const APP_NAME = "Pust";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0c0c0e" },
      {
        name: "description",
        content:
          "Køb Sheesha RockMe 50K hos Pust. 50.000 bars, hele serien med hookah-mundstykke og display. Hurtig levering i Danmark. Fra 229 kr.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Oswald:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="da" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ShopShell>
            <Outlet />
          </ShopShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
