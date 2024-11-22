
"use client"
import { AppSidebar } from "@/components/app-sidebar"
import DashAccount from "@/components/DashAccount";
// import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";


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

export default function Page() {




  return (
    <>
    <Head>
  <title>User Profile - Manage Your Personal Information</title>
  <meta name="description" content="View and edit your personal information, preferences, and settings on your User Profile page. Keep your details up to date with TurnItHuman." />
  <meta name="keywords" content="user profile, manage profile, personal information, settings, user account, TurnItHuman user page" />
  <meta name="author" content="TurnItHuman" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="User Profile - Manage Your Personal Information" />
  <meta property="og:description" content="Manage your personal information and settings on your TurnItHuman user profile page. Stay updated with your preferences and account details." />
  <meta property="og:url" content="https://turnit.vercel.app/user-profile" />
  <meta property="og:type" content="profile" />
  <meta property="og:image" content="/images/user-profile-preview.jpg" />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="User Profile - Manage Your Personal Information" />
  <meta name="twitter:description" content="Update your personal details and account settings on your TurnItHuman user profile page. Customize your preferences anytime." />
  <meta name="twitter:image" content="/images/user-profile-preview.jpg" />

  {/* Additional Tags for SEO */}
  <link rel="canonical" href="https://turnit.vercel.app/user-profile" />
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
                      <BreadcrumbPage>Account</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      {/* <ModeToggle/> */}
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <DashAccount />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
