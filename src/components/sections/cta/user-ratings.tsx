import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type UserRatingsProps = ComponentProps<"div"> & {};

export function UserRatings({ className, ...props }: UserRatingsProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border bg-background p-4 shadow shadow-black/5",
        className
      )}
      {...props}
    >
      <div className="flex -space-x-1.5">
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-03.jpg"
          width={20}
          height={20}
          alt="Avatar 01"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-04.jpg"
          width={20}
          height={20}
          alt="Avatar 02"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-05.jpg"
          width={20}
          height={20}
          alt="Avatar 03"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-06.jpg"
          width={20}
          height={20}
          alt="Avatar 04"
        />
      </div>
      <p className="px-2 text-base text-muted-foreground">
        Trusted by <strong className="font-medium text-foreground">60K+</strong>{" "}
        users
      </p>
    </div>
  );
}
