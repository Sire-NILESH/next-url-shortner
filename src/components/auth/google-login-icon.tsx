import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  className?: string;
};

const GoogleLoginIcon = ({ className }: Props) => {
  return (
    <Image
      width={25}
      height={25}
      className={cn("size-6", className)}
      src="./google-login-icon.svg"
      alt="google"
    />
  );
};

export default GoogleLoginIcon;
