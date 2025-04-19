interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className={`text-2xl font-bold ${variant === "light" ? "text-white" : "text-primary"}`}>
        <span className="text-secondary">VIP</span> Ride
      </span>
      <span className={`ml-1 text-sm ${variant === "light" ? "text-gray-300" : "text-gray-600"}`}>
        Istanbul Airport
      </span>
    </div>
  );
}
