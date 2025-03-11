import { Footer, FooterBottom } from "@/components/ui/footer";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";

export default function FooterCompact() {
  return (
    <footer className="w-full bg-background px-4">
      <div className="mx-auto max-w-container">
        <Footer className="pt-0">
          <FooterBottom className="mt-0 flex flex-col items-center gap-4 sm:flex-row md:flex-row">
            <div>© 2025 Sire inc. All rights reserved</div>
            <nav className="flex items-center gap-4">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>|
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <ThemeToggle />
            </nav>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
