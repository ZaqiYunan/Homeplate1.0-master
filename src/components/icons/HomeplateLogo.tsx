import type { ImgHTMLAttributes } from "react";

export function HomeplateLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="https://fxeogbzwstepyyjgvkrq.supabase.co/storage/v1/object/public/assets/homeplate-logo.png"
      alt="Homeplate Logo"
      width={80}
      height={80}
      {...props}
      data-ai-hint="logo plate"
    />
  );
}
