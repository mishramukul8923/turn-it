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
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Page() {
  const [fetchData, setFetchData] = useState(false);
  const [myPrompt, setMyPrompt] = useState(0)

  useEffect(() => {
    setMyPrompt(localStorage.getItem("my_prompt") || 0) // prompt to show on ui
  }, [])

  const updatePrompt = () => {
    setMyPrompt((prev) => --prev)
  }

  const updateinfo = () => {
    setFetchData(!fetchData)
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
          <AppSidebar updateinfo={updateinfo} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 bordhead">
              <div className="flex items-center gap-2 px-4 w-full justify-between">
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
                <Breadcrumb className="ml-auto">
                  <BreadcrumbList>
                    <BreadcrumbItem className="px-3 py-2 rounded-md bg-[#232325] mr-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <g clipPath="url(#clip0_1078_990)">
                          <path d="M3.0625 0.4375C1.61275 0.4375 0.4375 1.61275 0.4375 3.0625V5.25C0.4375 5.49163 0.633375 5.6875 0.875 5.6875C1.11662 5.6875 1.3125 5.49163 1.3125 5.25V3.0625C1.3125 2.096 2.096 1.3125 3.0625 1.3125H10.9375C11.904 1.3125 12.6875 2.096 12.6875 3.0625V9.1875C12.6875 10.0045 12.1276 10.6908 11.3706 10.8835C11.1364 10.9431 10.9375 11.1334 10.9375 11.375C10.9375 11.6166 11.1348 11.8163 11.3732 11.7765C12.6156 11.569 13.5625 10.4888 13.5625 9.1875V3.0625C13.5625 1.61275 12.3872 0.4375 10.9375 0.4375H3.0625Z" fill="white" />
                          <path d="M9.1875 11.8125C9.42913 11.8125 9.625 11.6166 9.625 11.375C9.625 11.1334 9.42913 10.9375 9.1875 10.9375H8.53125C8.4051 10.9375 8.28507 10.992 8.20199 11.0869L7 12.4606L5.79801 11.0869C5.71493 10.992 5.5949 10.9375 5.46875 10.9375H3.0625C2.096 10.9375 1.3125 10.154 1.3125 9.1875V7.4375C1.3125 7.19587 1.11662 7 0.875 7C0.633375 7 0.4375 7.19587 0.4375 7.4375V9.1875C0.4375 10.6372 1.61275 11.8125 3.0625 11.8125H5.27023L6.67074 13.4131C6.75382 13.508 6.87385 13.5625 7 13.5625C7.12615 13.5625 7.24618 13.508 7.32926 13.4131L8.72977 11.8125H9.1875Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.42661 3.40298C7.38132 3.20383 7.20425 3.0625 7 3.0625C6.79575 3.0625 6.61868 3.20383 6.57339 3.40298L6.33132 4.46751C6.21937 4.95989 5.83489 5.34437 5.34251 5.45632L4.27798 5.69839C4.07883 5.74368 3.9375 5.92075 3.9375 6.125C3.9375 6.32925 4.07883 6.50632 4.27798 6.55161L5.34251 6.79368C5.83489 6.90563 6.21937 7.29011 6.33132 7.78249L6.57339 8.84702C6.61868 9.04617 6.79575 9.1875 7 9.1875C7.20425 9.1875 7.38132 9.04617 7.42661 8.84702L7.66868 7.78249C7.78063 7.29011 8.16511 6.90563 8.65749 6.79368L9.72202 6.55161C9.92117 6.50632 10.0625 6.32925 10.0625 6.125C10.0625 5.92075 9.92117 5.74368 9.72202 5.69839L8.65749 5.45632C8.16511 5.34437 7.78063 4.95989 7.66868 4.46751L7.42661 3.40298ZM6.0459 6.125C6.45623 5.91559 6.79059 5.58123 7 5.1709C7.20941 5.58123 7.54377 5.91559 7.9541 6.125C7.54377 6.33441 7.20941 6.66877 7 7.0791C6.79059 6.66877 6.45623 6.33441 6.0459 6.125Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip0_1078_990">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <BreadcrumbPage className="text-[#F4F4F5] font-inter text-sm font-normal leading-none">
                        {myPrompt == -99 ? "Unlimited" : <><span>{myPrompt}</span> Prompt Left</>}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Humanizer fetchData={fetchData} updatePrompt={updatePrompt} />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
