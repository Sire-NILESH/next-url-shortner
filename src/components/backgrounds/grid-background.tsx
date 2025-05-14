import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export function GridBackgroundLayout({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "h-full min-h-screen min-w-screen flex justify-center relative",
        className
      )}
      {...props}
    >
      <div className="absolute -z-10 inset-0 h-full min-h-screen min-w-screen dark:bg-black bg-white dark:bg-dot-white/[0.10] bg-dot-black/[0.10] flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-gray-100 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />
      </div>

      <div className="container">{children}</div>
    </div>
  );
}
