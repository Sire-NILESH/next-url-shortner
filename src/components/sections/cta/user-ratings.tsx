import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type UserRatingsProps = ComponentProps<"div"> & {};

const avatarList = [
  { imgSrc: "https://originui.com/avatar-80-03.jpg", name: "Malcom" },
  { imgSrc: "https://originui.com/avatar-80-04.jpg", name: "Candice" },
  { imgSrc: "https://originui.com/avatar-80-05.jpg", name: "Silvia" },
  { imgSrc: "https://originui.com/avatar-80-06.jpg", name: "Serena" },
];

export function UserRatings({ className, ...props }: UserRatingsProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full",
        "sm:px-4 sm:py-3 sm:border sm:border-border sm:bg-background",
        className
      )}
      {...props}
    >
      <div className="flex -space-x-1.5">
        {avatarList.map((userAvatar, i) => (
          <Avatar key={i}>
            <AvatarImage
              loading="lazy"
              className="size-8"
              src={userAvatar.imgSrc}
              alt={userAvatar.name}
            />
          </Avatar>
        ))}
      </div>
      <p className="px-2 text-base text-muted-foreground">
        Trusted by <strong className="font-medium text-foreground">60K+</strong>{" "}
        users
      </p>
    </div>
  );
}
