'use client';

import LandingHeader from './_components/landing-header';
import LandingHero from './_components/landing-hero';
import HowItWorks from './_components/how-it-works';
import SecuritySection from './_components/security-section';
import TechStackMarquee from './_components/tech-stack-marquee';
import LandingFooter from './_components/landing-footer';

export default function Home() {
  return (
    <div className='min-h-screen bg-darkest-gray'>
      <LandingHeader />
      <main className='pt-16'>
        <LandingHero />
        <HowItWorks />
        <SecuritySection />
        <TechStackMarquee />
      </main>
      <LandingFooter />
    </div>
  );
}
