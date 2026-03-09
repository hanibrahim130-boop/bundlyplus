import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-[120px] bg-black text-white">
      <div className="container mx-auto px-8 max-w-[1320px]">
        <div className="flex flex-col items-center justify-center text-center mb-24 relative z-10">
          <h2 className="text-[clamp(60px,12vw,160px)] font-bold leading-[0.9] tracking-tighter uppercase text-white mb-[-20px]">
            Save big
          </h2>
          <h2 className="text-[clamp(60px,12vw,160px)] font-bold leading-[0.9] tracking-tighter uppercase text-white/10 italic">
            today
          </h2>

          <div className="mt-[-40px] relative">
            <div className="relative w-[140px] h-[140px] flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_10s_linear_infinite]">
                <path id="footerCircle" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none" />
                <text fill="rgba(255,255,255,0.4)" fontSize="13" fontWeight="bold" letterSpacing="4">
                  <textPath href="#footerCircle">GET IN TOUCH · BUNDLYPLUS · GET A DEAL ·</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-20 border-b border-white/10 relative z-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B+</span>
              </div>
              <span className="text-3xl font-bold tracking-tighter uppercase">
                Bundly<span className="text-primary">Plus</span>
              </span>
            </div>
            <p className="text-white/60 max-w-[400px] text-[16px] leading-relaxed mb-10">
              We provide high-quality digital subscriptions at competitive prices. Making premium digital content accessible to everyone.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/40 mb-2">Payment Methods</span>
                <div className="flex gap-4 items-center flex-wrap">
                  <span className="text-[12px] font-bold border border-white/20 px-2 py-1 rounded">VISA</span>
                  <span className="text-[12px] font-bold border border-white/20 px-2 py-1 rounded">OMT</span>
                  <span className="text-[12px] font-bold border border-white/20 px-2 py-1 rounded">WHISH</span>
                  <span className="text-[12px] font-bold border border-white/20 px-2 py-1 rounded">CRYPTO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-2xl font-bold text-white hover:text-white/60 transition-colors uppercase tracking-tighter">Home</a>
              <a href="#subscriptions" className="text-2xl font-bold text-white hover:text-white/60 transition-colors uppercase tracking-tighter">Deals</a>
              <a href="#features" className="text-2xl font-bold text-white hover:text-white/60 transition-colors uppercase tracking-tighter">How it Works</a>
              <a href="#reviews" className="text-2xl font-bold text-white hover:text-white/60 transition-colors uppercase tracking-tighter">Reviews</a>
            </nav>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-2">
              <p className="text-white font-bold text-[18px]">support@bundlyplus.com</p>
              <p className="text-white/60 text-sm">Available 24/7 for your digital needs.</p>
            </div>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pt-12 pb-12 overflow-hidden">
          <h2 className="text-[clamp(100px,25vw,400px)] font-bold text-transparent pointer-events-none select-none uppercase" style={{ WebkitTextStroke: '1px rgba(255, 79, 1, 0.1)' }}>
            BundlyPlus
          </h2>
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center text-center space-y-4 z-20">
            <p className="text-white/40 text-xs tracking-widest uppercase font-bold">
              ©2026 BUNDLYPLUS™ STUDIO. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F8] h-20 w-full flex items-center justify-center overflow-hidden">
        <p className="text-black/30 text-[10px] uppercase font-bold tracking-widest">Premium Digital Marketplace</p>
      </div>
    </footer>
  );
}
