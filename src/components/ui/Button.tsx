import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0B2D5B] text-white hover:bg-[#071F3F] border border-[#0B2D5B] hover:border-[#071F3F]",
  secondary:
    "bg-[#2E7D9A] text-white hover:bg-[#256880] border border-[#2E7D9A] hover:border-[#256880]",
  outline:
    "bg-white text-[#0B2D5B] hover:bg-[#F4F6F8] border border-[#0B2D5B]",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded transition-colors ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
