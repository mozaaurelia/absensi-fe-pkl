export default function LoginButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const base =
    "w-full py-3.5 rounded-lg text-sm font-semibold transition-colors";
  const variants = {
    primary: "bg-[#1E3A5F] text-white hover:bg-[#16304f]",
    outline:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      suppressHydrationWarning
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}