import { ModeToggle } from "@/components/mode-toggle";
import { ResetPassword } from "@/components/reset-password";
import { ThemeProvider } from "@/components/theme-provider";
import { Image } from 'react-bootstrap';
import Link from "next/link"; // Correct import for navigation links
import Head from "next/head";


export default function Page() {

  
  return (
    <>
    <Head>
  <title>Reset Password | TurnIt</title>
  <meta name="description" content="Reset your password securely on TurnIt. Follow the steps to regain access to your account." />
  <meta name="keywords" content="TurnIt, reset password, account recovery, secure password reset" />
  <meta name="author" content="TurnIt Team" />
  

  <meta property="og:title" content="Reset Password | TurnIt" />
  <meta property="og:description" content="Reset your password securely on TurnIt. Follow the steps to regain access to your account." />
  <meta property="og:url" content="https://turnit.vercel.app/reset-password" />
  <meta property="og:image" content="https://turnit.vercel.app/images/reset-password-image.png" />
  <meta property="og:type" content="website" />
  
  {/* <!-- Twitter Card Meta Tags --> */}
  <meta name="twitter:title" content="Reset Password | TurnIt" />
  <meta name="twitter:description" content="Reset your password securely on TurnIt. Follow the steps to regain access to your account." />
  <meta name="twitter:image" content="https://turnit.vercel.app/images/reset-password-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  
  {/* <!-- Favicon --> */}
  <link rel="icon" href="https://turnit.vercel.app/favicon.ico" />
</Head>

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
      <ResetPassword/>
    </div>
    </ThemeProvider>
    </>
  );
}
