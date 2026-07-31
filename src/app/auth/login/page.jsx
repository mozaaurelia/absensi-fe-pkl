import LoginLeftSection from "@/components/auth/login/LoginLeftSection";
import LoginCard from "@/components/auth/login/LoginCard";
import LanguageToggle from "@/components/LanguageToggle/LanguageToggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle dark={false} />
      </div>
      <LoginLeftSection />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <LoginCard />
      </div>
    </div>
  );
}