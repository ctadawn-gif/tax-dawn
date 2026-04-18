import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingTalk from "@/components/FloatingTalk";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <FadeInOnScroll>
          <Hero />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <Services />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <Problem />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <Testimonials />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <CTA />
        </FadeInOnScroll>
      </main>
      <ScrollToTop />
      <FloatingTalk />
    </>
  );
}
