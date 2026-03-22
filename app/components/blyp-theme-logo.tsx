import Image from "next/image";

type BlypThemeLogoProps = {
  width?: number;
  height?: number;
  className?: string;
  /** Shown for the light-mode asset; dark-mode image is decorative only */
  alt?: string;
};

export function BlypThemeLogo({
  width = 28,
  height = 28,
  className,
  alt = "Blyp",
}: BlypThemeLogoProps) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className ?? ""}`}>
      <Image
        src="/logos/logo-light.svg"
        alt={alt}
        width={width}
        height={height}
        className="object-contain dark:hidden"
      />
      <Image
        src="/logos/logo-dark.svg"
        alt=""
        width={width}
        height={height}
        className="hidden object-contain dark:block"
        aria-hidden
      />
    </span>
  );
}
