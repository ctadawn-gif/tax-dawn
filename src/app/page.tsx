import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import BlogSection from "@/components/blog/BlogSection";

// 블로그 섹션(네이버 RSS)을 1시간마다 갱신
export const revalidate = 3600;

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
          <BlogSection />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <CTA />
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
          <Location />
        </FadeInOnScroll>
      </main>
      <Footer />
    </>
  );
}
