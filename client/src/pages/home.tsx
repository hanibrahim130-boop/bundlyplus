import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import FeatureBento from "@/components/FeatureBento";
import ProductGrid from "@/components/ProductGrid";
import SubscriptionSection from "@/components/SubscriptionSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import MockupSection from "@/components/MockupSection";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen w-full pb-[120px]" style={{ overflowX: 'hidden' }}>
      <Navbar />
      <HeroSection />
      <ScrollReveal>
        <MarqueeTicker />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <FeatureBento />
      </ScrollReveal>
      <ScrollReveal>
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 lg:px-14 py-16 md:py-24" style={{ overflowX: "hidden" }}>
          <ProductGrid />
        </section>
      </ScrollReveal>
      <ScrollReveal>
        <SubscriptionSection />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
      <ScrollReveal>
        <MockupSection />
      </ScrollReveal>
      <CartDrawer />
      <ScrollReveal direction="up" distance={30}>
        <Footer />
      </ScrollReveal>
      <BackToTop />
    </main>
  );
}
