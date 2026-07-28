import ClientLayout from "@/components/ClientLayout/ClientLayout";
import Navbar from "@/components/landing/Navbar/page";
import Hero from "@/components/landing/Hero/page";
import Role from "@/components/landing/Role/page";
import Features from "@/components/landing/Features/page";
import Workflow from "@/components/landing/Workflow/page";
import CTA from "@/components/landing/CTA/page";
import Footer from "@/components/landing/Footer/page";

export default function LandingPage() {
  return (
    <ClientLayout>
      <main>
        <Navbar />
        <Hero />
        <Role />
        <Features />
        <Workflow />
        <CTA />
        <Footer />
      </main>
    </ClientLayout>
  );
}