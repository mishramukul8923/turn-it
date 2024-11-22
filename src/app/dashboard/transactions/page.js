import { AppSidebar } from "@/components/app-sidebar"
// import { ModeToggle } from "@/components/mode-toggle";
import PricingPr from "@/components/PricingPr";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import TransactionHistory from "./TransactionHistory";
import Head from "next/head";

export default function Page() {
  return (
    <>
    <Head>
  <title>Content transaction - Smooth AI to Human Content Conversion</title>
  <meta name="description" content="Experience seamless transactions from AI-generated content to human-like text. TurnItHuman ensures smooth and accurate content transformation." />
  <meta name="keywords" content="content transaction, AI to human content, humanized text, TurnItHuman transformation, AI content conversion, seamless transaction" />
  <meta name="author" content="TurnItHuman" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Content transaction - Smooth AI to Human Content Conversion" />
  <meta property="og:description" content="Transform AI-generated content into human-like text effortlessly. Experience accurate and natural transactions with TurnItHuman." />
  <meta property="og:url" content="https://turnit.vercel.app/transaction" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/transaction-page-preview.jpg" />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Content transaction - Smooth AI to Human Content Conversion" />
  <meta name="twitter:description" content="Transform AI-generated content into human-like text effortlessly. Experience accurate and natural transactions with TurnItHuman." />
  <meta name="twitter:image" content="/images/transaction-page-preview.jpg" />

  {/* Additional Tags for SEO */}
  <link rel="canonical" href="https://turnit.vercel.app/transaction" />
  <meta name="robots" content="index, follow" />
</Head>

     <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disabletransactionOnChange
          >
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bordhead">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Transactions</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem>
                {/* <ModeToggle/> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <TransactionHistory />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
    </>
  );
}
