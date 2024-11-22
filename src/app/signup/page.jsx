// import { ModeToggle } from "@/components/mode-toggle";
import { SignUpForm } from "@/components/signup-form"
import { ThemeProvider } from "@/components/theme-provider";
import { Image } from 'react-bootstrap';
import Link from "next/link"; // Correct import for navigation links
import Head from "next/head";


export default function Page() {
  return (
    <>
      <Head>
  <title>Sign Up - Create Your Account</title>
  <meta name="description" content="Sign up for an account to enjoy full access to our features. Quick and easy registration." />
  <meta name="keywords" content="signup, user registration, create account, register now" />
  <meta name="author" content="Your Website Name" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Sign Up - Create Your Account" />
  <meta property="og:description" content="Sign up for an account to enjoy full access to our features. Quick and easy registration." />
  <meta property="og:url" content="https://turnit.vercel.app/signup" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/signup-page-preview.jpg" />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Sign Up - Create Your Account" />
  <meta name="twitter:description" content="Sign up for an account to enjoy full access to our features. Quick and easy registration." />
  <meta name="twitter:image" content="/images/signup-page-preview.jpg" />
</Head>
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
