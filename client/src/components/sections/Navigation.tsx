import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

export default function Navigation() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Subscriptions', href: '#subscriptions' },
    { label: 'How it Works', href: '#features' },
    { label: 'Reviews', href: '#reviews' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ease-in-out ${
        isSticky ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-8 max-w-[1320px]">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B+</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-black uppercase">
                Bundly<span className="text-primary">Plus</span>
              </span>
            </a>
          </div>

          <nav className="hidden lg:flex items-center justify-center flex-grow">
            <ul className="flex items-center space-x-12">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[12px] font-bold text-black uppercase tracking-[2px] hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-10">
            <div className="hidden md:block">
              <a
                href="#subscriptions"
                className="text-[12px] font-bold text-black uppercase tracking-[2px] border-b border-black pb-1 hover:text-primary hover:border-primary transition-all"
              >
                Get Started
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="group relative flex flex-col items-end justify-between w-[30px] h-[18px] focus:outline-none"
              aria-label="Toggle Menu"
              data-testid="button-mobile-menu"
            >
              <span className={`w-full h-[2px] bg-black transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
              <span className={`h-[2px] bg-black transition-all duration-300 group-hover:w-full ${mobileMenuOpen ? 'opacity-0 w-full' : 'w-[14px]'}`} />
              <span className={`w-full h-[2px] bg-black transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 py-10 px-8 shadow-xl transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-black uppercase tracking-wider hover:opacity-50 transition-opacity"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-6 mt-6 border-t border-gray-100">
            <a
              href="#subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-black uppercase tracking-widest"
            >
              Get Started
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
