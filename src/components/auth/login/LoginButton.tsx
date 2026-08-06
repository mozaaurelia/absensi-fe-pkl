import type { ReactNode } from "react";

type LoginButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline";
  disabled?: boolean;
};

export default function LoginButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: LoginButtonProps) {
  const base =
    "w-full py-3.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#1E3A5F] text-white hover:bg-[#16304f]",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      suppressHydrationWarning
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
