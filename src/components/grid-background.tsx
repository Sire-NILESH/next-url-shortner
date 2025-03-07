import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export function GridBackgroundLayout({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "h-full min-h-screen min-w-screen flex items-center justify-center relative",
        className
      )}
      {...props}
    >
      <div className="absolute -z-10 inset-0 h-full min-h-screen min-w-screen dark:bg-black bg-white dark:bg-dot-white/[0.20] bg-dot-black/[0.20] flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="container mx-2">{children}</div>
    </div>
  );
}
