import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import FeatureBento from "@/components/FeatureBento";
import SubscriptionSection from "@/components/SubscriptionSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import MockupSection from "@/components/MockupSection";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <FeatureBento />
      <SubscriptionSection />
      <Testimonials />
      <FAQ />
      <MockupSection />
      <CartDrawer />
      <Footer />
    </main>
  );
}
