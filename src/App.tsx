import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Skills } from './components/Skills.tsx';
import { Projects } from './components/Projects.tsx';
import { Leadership } from './components/Leadership.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { VisitorTracker } from './components/VisitorTracker.tsx';

function PortfolioMain() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Visitor telemetry tracker (fires once per session to report IP and trigger Resend email) */}
      <VisitorTracker />

      {/* Header Navigation */}
      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Leadership />
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Modals */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}
