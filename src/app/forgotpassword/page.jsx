// import { ModeToggle } from "@/components/mode-toggle";
import { ForgotPassword } from "@/components/forgot-password";
import { ThemeProvider } from "@/components/theme-provider";
import Image from 'react-bootstrap/Image';
import Link from "next/link"; // Correct import for navigation links
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
    <title>Forgot Password - Reset Your Account</title>
    <meta name="description" content="Reset your password easily with our secure password recovery system. Regain access to your account in minutes." />
    <meta name="keywords" content="forgot password, reset password, password recovery, account access" />
    <meta name="author" content="Your Website Name" />
  
    {/* Open Graph Meta Tags */}
    <meta property="og:title" content="Forgot Password - Reset Your Account" />
    <meta property="og:description" content="Reset your password easily with our secure password recovery system. Regain access to your account in minutes." />
    <meta property="og:url" content="https://turnit.vercel.app/forgot-password" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/images/forgot-password-preview.jpg" />
  
    {/* Twitter Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Forgot Password - Reset Your Account" />
    <meta name="twitter:description" content="Reset your password easily with our secure password recovery system. Regain access to your account in minutes." />
    <meta name="twitter:image" content="/images/forgot-password-preview.jpg" />
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
          <ForgotPassword />
        </div>
      </ThemeProvider>
    </>
  );
}
