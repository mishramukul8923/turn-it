import { LoginForm } from "@/components/login-form"
import { ThemeProvider } from "@/components/theme-provider";
import { Image } from 'react-bootstrap';
import Link from "next/link"; // Correct import for navigation links



export default function Page() {
  // return (
  //   <>
  //    (<div className="flex h-screen w-full items-center justify-center px-4">
  //        <div className="turnitHumanLogo">
  //     <Image src="/images/turnit-logo.svg" alt="Open Menu" fluid />
  //     </div>
  //     <LoginForm />
  //   </div>)
  //   </>
   
  // );
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
      <LoginForm />
    </div>
    </ThemeProvider>
    </>
  );
}
