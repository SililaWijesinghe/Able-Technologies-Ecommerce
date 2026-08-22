import Header from '../components/Header';
import ContactHero from '../components/contact/ContactHero';
import TrustBenefits from '../components/contact/TrustBenefits';
import ContactForm from '../components/contact/ContactForm';
import DirectContactCard from '../components/contact/DirectContactCard';
import LocationMap from '../components/contact/LocationMap';
import WhyChooseContact from '../components/contact/WhyChooseContact';
import CustomSolutionCTA from '../components/contact/CustomSolutionCTA';
import FAQ from '../components/contact/FAQ';
import Newsletter from '../components/contact/Newsletter';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-red-500 selection:text-white">
      <Header />
      
      <main>
        <ContactHero />
        <TrustBenefits />

        {/* Main Contact Section */}
        <section className="container mx-auto px-6 max-w-7xl mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
            <ContactForm />
            <DirectContactCard />
          </div>
        </section>

        {/* Location & Why Choose Us */}
        <section className="container mx-auto px-6 max-w-7xl mb-16 md:mb-24 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            <LocationMap />
            <WhyChooseContact />
          </div>
        </section>

        <CustomSolutionCTA />
        <FAQ />
        <Newsletter />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
