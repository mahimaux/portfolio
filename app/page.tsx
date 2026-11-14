import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { LogoStrip } from "@/components/LogoStrip";
import { GoogleMoment } from "@/components/GoogleMoment";
import { WorkHelix } from "@/components/WorkHelix";
import { Receipts } from "@/components/Receipts";
import { Toolkit } from "@/components/Toolkit";
import { Process } from "@/components/Process";
import { CaseStudies } from "@/components/CaseStudies";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <LogoStrip />
      <Process />
      <GoogleMoment />
      <CaseStudies />
      <Toolkit />
      <WorkHelix />
      <Receipts />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
