import LoginLeftSection from "@/components/auth/login/LoginLeftSection";
import SuperAdminLoginForm from "@/components/auth/login/SuperAdminLoginForm";
import LanguageToggle from "@/components/common/LanguageToggle";

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle dark={false} />
      </div>
      <LoginLeftSection />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <SuperAdminLoginForm />
      </div>
    </div>
  );
}