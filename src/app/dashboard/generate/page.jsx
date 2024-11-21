"use client";
import { AppSidebar } from "@/components/app-sidebar"
import Generate from "@/components/Generate";
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

export default function Page() {

  const [fetchData, setFetchData] = useState(false)
  
  function updategneinfo (){
    setFetchData(!fetchData)
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
    <AppSidebar updategneinfo ={updategneinfo }/>
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
                  <BreadcrumbPage>Generate</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem>
                {/* <ModeToggle/> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Generate fetchData={fetchData}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
    </>
  );
}
