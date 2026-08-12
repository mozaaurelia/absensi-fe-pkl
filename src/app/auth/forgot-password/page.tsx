import LoginLeftSection from "@/components/auth/login/LoginLeftSection";
import ForgotPasswordCard from "@/components/auth/forgot-password/ForgotPasswordCard";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <LoginLeftSection />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <ForgotPasswordCard />
      </div>
    </div>
  );
}
