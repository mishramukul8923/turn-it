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
import Head from "next/head";

export default function Page() {
  return (
    <>
        <Head>
  <title>Pricing Plans - Subscribe to TurnItHuman</title>
  <meta name="description" content="Explore flexible pricing plans for TurnItHuman and subscribe to unlock powerful tools to humanize your content. Choose the plan that suits your needs." />
  <meta name="keywords" content="TurnItHuman pricing, subscription plans, content humanizer, buy plans, flexible pricing, AI tools, humanize AI content" />
  <meta name="author" content="TurnItHuman" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Pricing Plans - Subscribe to TurnItHuman" />
  <meta property="og:description" content="Unlock TurnItHuman's features with flexible subscription plans. Choose the perfect plan to transform AI-generated content into human-like writing." />
  <meta property="og:url" content="https://turnit.vercel.app/pricing" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/pricing-page-preview.jpg" />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pricing Plans - Subscribe to TurnItHuman" />
  <meta name="twitter:description" content="Unlock TurnItHuman's features with flexible subscription plans. Choose the perfect plan to transform AI-generated content into human-like writing." />
  <meta name="twitter:image" content="/images/pricing-page-preview.jpg" />

  {/* Additional Tags for SEO */}
  <link rel="canonical" href="https://turnit.vercel.app/pricing" />
  <meta name="robots" content="index, follow" />
</Head>
     <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
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
                  <BreadcrumbPage>Pricing Plans</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem>
                {/* <ModeToggle/> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <PricingPr/>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
    </>
  );
}
