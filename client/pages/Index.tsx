import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Benefits from "@/components/sections/Benefits";
import Gallery from "@/components/sections/Gallery";
import Inventory from "@/components/sections/Inventory";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import WhatsappFab from "@/components/sections/WhatsappFab";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <Gallery />
        <Inventory />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
