import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserAvatar = ({
  userName,
  imgUrl,
  className,
}: {
  userName?: string | null;
  imgUrl?: string | null;
  className?: string | null;
}) => {
  return (
    <Avatar
      className={cn(
        "rounded-full h-full w-full bg-primary text-primary-foreground",
        className
      )}
    >
      <AvatarImage
        src={imgUrl ? imgUrl : undefined}
        alt={userName ? userName : "user"}
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {userName ? userName[0].toUpperCase() : "?"}
      </AvatarFallback>
    </Avatar>
  );
};
