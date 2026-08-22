import { motion } from 'motion/react';
import NewsletterCTA from '../components/NewsletterCTA';
import ContactTrustBar from '../components/contact/ContactTrustBar';
import ContactFormSection from '../components/contact/ContactFormSection';
import LocationAndWhyUs from '../components/contact/LocationAndWhyUs';
import CustomSolutionCTA from '../components/contact/CustomSolutionCTA';
import FAQAndPromise from '../components/contact/FAQAndPromise';
import heroBg from '../assets/heroBg.webp';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative w-full h-[300px] md:h-[350px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b] via-[#0b1042]/90 to-transparent z-0 w-full"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10 flex flex-col justify-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
          >
            <div className="flex items-center text-gray-300 text-sm mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-white font-medium">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
              We're here to help you find the right machine, part or solution. Get in touch with our experts today!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Highlights */}
      <ContactTrustBar />

      {/* Main Contact Section */}
      <ContactFormSection />

      {/* Location and Why Choose Us */}
      <LocationAndWhyUs />

      {/* Custom Solution CTA */}
      <CustomSolutionCTA />

      {/* FAQ and Support Promise */}
      <FAQAndPromise />

      {/* Newsletter */}
      <NewsletterCTA />
    </div>
  );
}
