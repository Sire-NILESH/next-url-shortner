import { Footer, FooterBottom } from "@/components/ui/footer";
import { ThemeToggle } from "../theme/theme-toggle";
import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"footer"> & {
  disableActionBtns?: boolean;
};

export default function FooterCompact({
  className,
  disableActionBtns,
  ...props
}: Props) {
  return (
    <footer className={cn("w-full bg-background px-4", className)} {...props}>
      <div className="mx-auto max-w-container">
        <Footer className="pt-0">
          <FooterBottom className="mt-0 flex flex-col items-center gap-4 sm:flex-row md:flex-row">
            <div>© 2025 Sire inc. All rights reserved</div>
            <nav className="flex items-center gap-4">
              <Link href="/">Home</Link>
              <Link href="/login">Login</Link>|
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              {!disableActionBtns && <ThemeToggle />}
            </nav>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
