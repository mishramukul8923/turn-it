import { LoginForm } from "@/components/login-form"
import { ThemeProvider } from "@/components/theme-provider";
import { Image } from 'react-bootstrap';
import Link from "next/link"; // Correct import for navigation links
import Head from "next/head";


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
       <Head>
  <title>Login - Access Your Account</title>
  <meta name="description" content="Log in to your account to access all features and manage your settings. Secure and easy login." />
  <meta name="keywords" content="login, user login, secure login, account access" />
  <meta name="author" content="Your Website Name" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Login - Access Your Account" />
  <meta property="og:description" content="Log in to your account to access all features and manage your settings. Secure and easy login." />
  <meta property="og:url" content="https://turnit.vercel.app/login" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/login-page-preview.jpg" />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Login - Access Your Account" />
  <meta name="twitter:description" content="Log in to your account to access all features and manage your settings. Secure and easy login." />
  <meta name="twitter:image" content="/images/login-page-preview.jpg" />
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
      <LoginForm />
    </div>
    </ThemeProvider>
    </>
  );
}