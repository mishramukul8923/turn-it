import { ModeToggle } from "@/components/mode-toggle";
import { ChangePassword } from "@/components/change-password";
import { ThemeProvider } from "@/components/theme-provider";
import Image from 'react-bootstrap/Image';
import Link from "next/link"; // Correct import for navigation links


export default function Page() {
  return (
    <>
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >

    <div className="flex h-screen w-full items-center justify-center px-4 flex-col">
    <div className="turnitHumanLogo">
    <Link href="/">
              <Image src="/images/turnit-logo.svg" alt="TurnIt Logo" fluid />
            </Link>
      </div>
      <ChangePassword />
    </div>
    </ThemeProvider>
    </>
  );
}
