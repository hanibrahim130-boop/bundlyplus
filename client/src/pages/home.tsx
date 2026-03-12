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

export default function Home() {
  return (
    <main className="bg-[#1f2626] min-h-screen w-full pb-[120px]" style={{ overflowX: 'hidden' }}>
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <FeatureBento />
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 lg:px-14 py-16 md:py-24" style={{ overflowX: "hidden" }}>
        <ProductGrid />
      </section>
      <SubscriptionSection />
      <Testimonials />
      <FAQ />
      <MockupSection />
      <CartDrawer />
      <Footer />
    </main>
  );
}
