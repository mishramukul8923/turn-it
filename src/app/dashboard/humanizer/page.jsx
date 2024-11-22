"use client"
import { AppSidebar } from "@/components/app-sidebar"
import Humanizer from "@/components/Humanizer";
// import { ModeToggle } from "@/components/mode-toggle";
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
import { useState } from "react";
import Head from "next/head";

export default function Page() {
  const [fetchData, setFetchData] = useState(false);

  const updateinfo = () => {
    setFetchData(!fetchData)
    console.log("update info response in humanizer page ",fetchData)
    return fetchData
  }
  return (
    <>
      <Head>
        <title>Humanize AI-Generated Content</title>
        <meta 
          name="description" 
          content="Convert AI-generated text into more human-readable, natural, and engaging content with our Humanizer tool." 
        />
        <meta 
          name="keywords" 
          content="AI-generated content, humanize, text conversion, natural language, AI text, content editing, content humanizer" 
        />
        <meta name="author" content="Your Website Name" />
        
        {/* Open Graph meta tags for better social media sharing */}
        <meta property="og:title" content="Humanize AI-Generated Content" />
        <meta 
          property="og:description" 
          content="Convert AI-generated text into more human-readable, natural, and engaging content with our Humanizer tool." 
        />
        <meta property="og:image" content="/images/ai-humanizer-preview.jpg" />
        <meta property="og:url" content="https://turnit.vercel.app/humanizer" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Humanize AI-Generated Content" />
        <meta 
          name="twitter:description" 
          content="Convert AI-generated text into more human-readable, natural, and engaging content with our Humanizer tool." 
        />
        <meta name="twitter:image" content="/images/ai-humanizer-preview.jpg" />
      </Head>
     <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
    <SidebarProvider>
      <AppSidebar updateinfo={updateinfo}/>
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
                  <BreadcrumbPage>Humanizer</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem>
                {/* <ModeToggle/> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Humanizer fetchData={fetchData}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
    </>
  );
}
