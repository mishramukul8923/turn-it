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

export default function Page() {
  const [fetchData, setFetchData] = useState(false);

  const updateinfo = () => {
    setFetchData(!fetchData)
    console.log("update info response in humanizer page ",fetchData)
    return fetchData
  }
  return (
    <>
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
