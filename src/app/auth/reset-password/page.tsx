import LoginLeftSection from "@/components/auth/login/LoginLeftSection";
import ResetPasswordCard from "@/components/auth/reset-password/ResetPasswordCard";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex bg-gray-50">
      <LoginLeftSection />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <ResetPasswordCard token={params.token ?? ""} />
      </div>
    </div>
  );
}