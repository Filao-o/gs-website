import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ReservationSection from "@/components/ReservationSection";
import DriverPresentation from "@/components/DriverPresentation";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ReservationSection />
        <DriverPresentation />
        <Services />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
