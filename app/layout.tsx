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

const SITE = "https://designbymahima.vercel.app/";
const TITLE = "Mahima Shastry | UX and product designer for AI agents";
const DESC =
  "UX and product designer for AI agent experiences, human-in-the-loop workflows, accessibility and content design. Around four years at IBM and Software AG on webMethods, with contributions to the IBM Carbon design system.";

// Structured data so search engines and recruiter tools can read role, skills and profiles.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mahima Shastry",
  url: SITE,
  jobTitle: "UX and Product Designer",
  description: DESC,
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  alumniOf: [
    { "@type": "Organization", name: "IBM" },
    { "@type": "Organization", name: "Software AG" },
  ],
  knowsAbout: [
    "UX design",
    "Product design",
    "Agent experience (AX)",
    "Human-in-the-loop design",
    "Generative AI UX",
    "Interaction design",
    "Information architecture",
    "Design systems",
    "IBM Carbon",
    "Accessibility",
    "WCAG 2.2 AA",
    "Content design",
    "UX writing",
    "Content strategy",
    "Prototyping",
    "Usability testing",
    "Figma",
  ],
  sameAs: brand.socials.filter((s) => /^https?:/.test(s.href)).map((s) => s.href),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  keywords: [
    "UX designer",
    "Product designer",
    "AI UX designer",
    "Agent experience",
    "AX design",
    "Human-in-the-loop",
    "Generative AI UX",
    "Interaction design",
    "Design systems",
    "Accessibility",
    "Content designer",
    "UX writer",
    "Information architecture",
    "IBM Carbon",
    "Bangalore",
  ],
  authors: [{ name: "Mahima Shastry", url: SITE }],
  alternates: { canonical: SITE },
  icons: { icon: [{ url: "./favicon.svg", type: "image/svg+xml" }], apple: "./apple-touch-icon.png" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Mahima Shastry",
    images: [{ url: "https://designbymahima.vercel.app/og.jpg", width: 1200, height: 630, alt: "Mahima Shastry, UX designer: less \u201cwait, what?\u201d, more \u201coh, nice?\u201d" }],
    title: TITLE,
    description: DESC,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["https://designbymahima.vercel.app/og.jpg"] },
};
export const viewport: Viewport = { themeColor: "#f2eee3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="is-locked">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="./rwd.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
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
