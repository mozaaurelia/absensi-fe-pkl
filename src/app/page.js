import ClientLayout from "@/components/layout/ClientLayout";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Role from "@/components/landing/Role";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

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