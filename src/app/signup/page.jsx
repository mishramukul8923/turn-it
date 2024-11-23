// import { ModeToggle } from "@/components/mode-toggle";
import { SignUpForm } from "@/components/signup-form"
import { ThemeProvider } from "@/components/theme-provider";
import { Image } from 'react-bootstrap';
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
{/* <div className="fixed">
<ModeToggle/>
</div> */}
    <div className="flex h-screen w-full items-center justify-center px-4 flex-col">
    <div className="turnitHumanLogo">
    <Link href="/">
              <Image src="/images/turnit-logo.svg" alt="TurnIt Logo" fluid />
            </Link>
      </div>
      <SignUpForm />
    </div>
    </ThemeProvider>
    </>
  );
}
