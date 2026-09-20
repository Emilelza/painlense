import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, FileText, SlidersHorizontal, TrendingUp, ChevronDown, Menu, X } from 'lucide-react';

export default function LandingPage({ navigate }) {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'view-patient'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNavigateToAccess = () => {
    setMobileMenuOpen(false);
    if (typeof navigate === 'function') {
      navigate('/access');
    } else {
      window.location.href = '/access';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              PainLens
            </span>
          </a>

          {/* Desktop Navigation Right */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'home'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'about'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </a>
            <button
              onClick={(e) => scrollToSection(e, 'view-patient')}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              View Patient
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-4 space-y-3 shadow-lg">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className={`block text-base font-medium py-2 ${
                activeSection === 'home' ? 'text-blue-600 font-bold' : 'text-slate-700'
              }`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className={`block text-base font-medium py-2 ${
                activeSection === 'about' ? 'text-blue-600 font-bold' : 'text-slate-700'
              }`}
            >
              About
            </a>
            <button
              onClick={(e) => scrollToSection(e, 'view-patient')}
              className="w-full text-left font-semibold text-blue-600 py-2"
            >
              View Patient
            </button>
          </div>
        )}
      </header>

      {/* 3. HOME SECTION */}
      <section
        id="home"
        className="min-h-screen scroll-mt-20 bg-gradient-to-b from-white via-slate-50/60 to-blue-50/30 relative flex flex-col justify-between overflow-hidden"
      >
        {/* Background Blurred Blue Circles */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 max-w-6xl mx-auto px-6 w-full flex items-center justify-center py-16">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Small Label */}
            <span className="text-blue-600 text-sm font-semibold tracking-wide mb-4 inline-block">
              Pain insight for care teams
            </span>

            {/* Headline */}
            <h1 className="text-[38px] sm:text-[54px] lg:text-[64px] font-extrabold text-slate-900 leading-[1.05] tracking-tight text-balance mb-6">
              Understand pain trends across{' '}
              <span className="text-[#3B82F6]">different observers.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              PainLens helps care teams understand pain trends when different observers describe the same patient differently.
            </p>

            {/* Single CTA Button */}
            <button
              onClick={(e) => scrollToSection(e, 'view-patient')}
              className="h-12 px-6 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold inline-flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>View Patient</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="pb-8 text-center flex flex-col items-center justify-center gap-1.5 text-slate-400">
          <span className="text-xs font-medium tracking-wider uppercase text-slate-400">Scroll</span>
          <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="id-about scroll-mt-20 bg-white py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-4">
            Same pain. Different words.
          </h2>

          {/* Explanation */}
          <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto leading-relaxed mb-16">
            Different visitors may describe the same patient&apos;s pain differently, and PainLens helps correct for those observer differences to reveal the underlying trend.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start h-full">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Read the note</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Turns a visit note into a 0–10 score.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start h-full">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Correct the bias</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Adjusts for each visitor&apos;s reporting style.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start h-full">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">See the real trend</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Alerts the nurse when pain is truly rising.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIEW PATIENT SECTION */}
      <section
        id="view-patient"
        className="scroll-mt-20 min-h-[60vh] bg-[#0B1F3A] flex flex-col items-center justify-center text-center py-24 px-6 relative"
      >
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to see the real trend?
          </h2>

          {/* Subtext */}
          <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Access patient records and observer trend insights.
          </p>

          {/* Single White Button CTA */}
          <button
            onClick={handleNavigateToAccess}
            className="h-12 px-8 rounded-xl bg-white text-[#0B1F3A] hover:bg-slate-100 font-semibold inline-flex items-center gap-2 transition-all shadow-lg shadow-black/20 cursor-pointer"
          >
            <span>View Patient</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Small Footer */}
          <p className="text-slate-400 text-sm font-medium mt-16">
            PainLens
          </p>
        </div>
      </section>
    </div>
  );
}
