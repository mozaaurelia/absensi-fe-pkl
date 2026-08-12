export default function EmployeeAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const sizes: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] dark:bg-blue-400/20 dark:text-blue-300 flex items-center justify-center font-bold shrink-0`}
    >
      {initials || "-"}
    </div>
  );
}
