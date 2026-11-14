import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/inter-tight/800.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/700.css";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/600.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { SoundToggle } from "@/components/SoundToggle";
import { Gate } from "@/components/Gate";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mahima Shastry | UX designer",
  description: "UX designer working on agent experience, AI explainability and accessibility. Around four years at IBM on webMethods.",
  icons: { icon: [{ url: "./favicon.svg", type: "image/svg+xml" }], apple: "./apple-touch-icon.png" },
  // Add og:image here once the site has its own domain (it needs an absolute URL).
  openGraph: {
    type: "website",
    title: "Mahima Shastry | UX designer",
    description: "UX designer working on agent experience, AI explainability and accessibility. Around four years at IBM on webMethods.",
  },
  twitter: { card: "summary", title: "Mahima Shastry | UX designer" },
};
export const viewport: Viewport = { themeColor: "#f2eee3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="is-locked">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="./rwd.css" />
      </head>
      <body>
        <SmoothScroll />
        <Gate />
        <a href="#process" className="skip-link">
          Skip to work
        </a>
        <Cursor />
        <Nav />
        <SoundToggle />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
