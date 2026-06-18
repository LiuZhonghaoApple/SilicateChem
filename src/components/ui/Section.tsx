type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "grey" | "blue";
};

const backgrounds = {
  white: "bg-white",
  grey: "bg-[#F4F6F8]",
  blue: "bg-[#0B2D5B] text-white",
};

export function Section({
  children,
  className = "",
  id,
  background = "white",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-20 ${backgrounds[background]} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  light = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2
        className={`text-2xl md:text-3xl font-bold tracking-tight ${light ? "text-white" : "text-[#0B2D5B]"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base md:text-lg max-w-3xl ${centered ? "mx-auto" : ""} ${light ? "text-blue-100" : "text-[#5A6570]"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
