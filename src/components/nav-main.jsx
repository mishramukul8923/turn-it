"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export function NavMain({ items="" ,  updateinfo="" , updategneinfo =""}) {

//  console.log("update info response in nav main component ",updateinfo)
//  console.log("update geninfo response in nav main component ",updategneinfo)


  const [generatorHistory, setGeneratorHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId')
      try {
        const response = await fetch(`/api/history/generator/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch generator history');
        }
        const data = await response.json();
        setGeneratorHistory([...data].reverse()); // Reverse the array safely
       
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);


  // Define your static data array with items from props or fallback to an empty array
  const data = [
    {
      title: "Humanizer",
      url: "/dashboard/humanizer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g clipPath="url(#clip0_937_639)">
          <path d="M17.9729 15.3792H17.1927C15.5092 15.3792 13.8964 14.8602 12.5289 13.8781L11.8948 13.4228C11.8705 13.4054 11.8478 13.3859 11.8268 13.3646C10.4505 11.9677 9.69258 10.1185 9.69258 8.15734C9.69258 7.49739 9.15568 6.96044 8.49569 6.96044C7.83577 6.96044 7.29883 7.49735 7.29883 8.15734C7.29883 8.95764 7.3953 9.7534 7.58556 10.5225C7.65552 10.8052 7.48305 11.0911 7.20032 11.1611C6.91738 11.2309 6.63167 11.0585 6.56178 10.7758C6.35102 9.92394 6.24414 9.04292 6.24414 8.15737C6.24414 6.91583 7.25418 5.90579 8.49569 5.90579C9.7372 5.90579 10.7473 6.91583 10.7473 8.15737C10.7473 9.82505 11.3861 11.3984 12.5472 12.5929L13.1441 13.0215C14.3313 13.874 15.7313 14.3245 17.1927 14.3245H17.9729C18.2642 14.3245 18.5003 14.5606 18.5003 14.8519C18.5003 15.1431 18.2642 15.3792 17.9729 15.3792Z" fill="#F4F4F5"/>
          <path d="M16.0557 17.9301H15.2707C13.7609 17.9301 12.2699 17.5421 10.9588 16.808C9.63721 16.0681 8.53303 14.995 7.7656 13.7048C7.61671 13.4545 7.69894 13.1309 7.94926 12.982C8.1995 12.833 8.52318 12.9153 8.67207 13.1656C9.34499 14.2969 10.3139 15.2382 11.4741 15.8877C12.6281 16.5338 13.9409 16.8754 15.2707 16.8754H16.0558C16.347 16.8754 16.5831 17.1115 16.5831 17.4027C16.5831 17.6939 16.347 17.9301 16.0557 17.9301Z" fill="#F4F4F5"/>
          <path d="M17.9729 12.5606H17.0204C15.8634 12.5606 14.7653 12.1212 13.9285 11.3234C13.0854 10.5196 12.6032 9.44154 12.5706 8.28785C12.5694 8.24475 12.5687 8.20123 12.5687 8.1576C12.5687 5.91168 10.7416 4.0845 8.49568 4.0845C7.2123 4.0845 6.02993 4.67116 5.25178 5.69399C5.0754 5.92585 4.74451 5.97074 4.51276 5.7944C4.28098 5.61805 4.23601 5.2872 4.41239 5.05541C5.3917 3.7681 6.87997 3.02982 8.49565 3.02982C11.3231 3.02982 13.6234 5.33012 13.6234 8.1576C13.6234 8.19114 13.6239 8.22457 13.6249 8.2579C13.6495 9.13192 14.0158 9.94945 14.6563 10.5601C15.296 11.17 16.1356 11.5059 17.0204 11.5059H17.9729C18.2641 11.5059 18.5002 11.742 18.5002 12.0333C18.5002 12.3245 18.2641 12.5606 17.9729 12.5606Z" fill="#F4F4F5"/>
          <path d="M7.66848 17.9302C7.53165 17.9302 7.39496 17.8773 7.29164 17.7718C4.87461 15.3034 3.48372 12.0447 3.37527 8.59617C3.36609 8.30508 3.59464 8.06166 3.88577 8.05252C4.17686 8.04383 4.42029 8.27193 4.42943 8.56302C4.52959 11.7466 5.8137 14.7549 8.04528 17.0339C8.24905 17.242 8.2455 17.5759 8.03741 17.7797C7.93479 17.8802 7.80161 17.9302 7.66848 17.9302Z" fill="#F4F4F5"/>
          <path d="M15.9721 8.68423C15.6809 8.68423 15.4448 8.44812 15.4448 8.15689C15.4448 6.34497 14.7514 4.62984 13.4925 3.32747C12.2376 2.02936 10.5554 1.27832 8.75505 1.21233L8.71929 1.2117C7.86088 1.19641 7.01312 1.32564 6.19866 1.59596C4.90519 2.0487 3.78216 2.86861 2.95061 3.96721C2.1038 5.08602 1.62089 6.41845 1.55417 7.82037C1.5407 8.10275 1.30751 8.32265 1.02781 8.32265C1.01937 8.32265 1.0109 8.32244 1.00228 8.32202C0.711402 8.30817 0.486788 8.06112 0.500605 7.7702C0.577527 6.15495 1.13394 4.61978 2.10967 3.33067C3.06778 2.0648 4.36276 1.12019 5.85462 0.598927C5.85712 0.598048 5.85965 0.597205 5.86218 0.596361C6.79136 0.287408 7.75942 0.139857 8.73807 0.157154L8.7786 0.157892C8.78184 0.157927 8.78504 0.158033 8.78823 0.158138C10.8643 0.232845 12.8042 1.09808 14.2507 2.59443C15.7008 4.09451 16.4994 6.06994 16.4994 8.15689C16.4995 8.44812 16.2634 8.68423 15.9721 8.68423Z" fill="#F4F4F5"/>
          <path d="M3.19632 16.772C3.01478 16.772 2.83815 16.6782 2.74013 16.51C1.78037 14.8621 1.11778 13.0774 0.770646 11.2052C0.717561 10.9188 0.906666 10.6436 1.19305 10.5906C1.4795 10.5373 1.7546 10.7266 1.80769 11.0129C2.1326 12.7655 2.753 14.4364 3.65153 15.9792C3.79809 16.2309 3.71291 16.5537 3.46122 16.7003C3.37776 16.7489 3.28646 16.772 3.19632 16.772Z" fill="#F4F4F5"/>
        </g>
        <defs>
          <clipPath id="clip0_937_639">
            <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)"/>
          </clipPath>
        </defs>
      </svg>
      ),
      isActive: true,
      items: items && items.length ? items.slice(0, 3).map((item) => ({
        key: item.createdAt,
        // title: truncateText(item.text, 2), // Truncate to 10 words
        title: item.text,
        createdId: item.createdAt,
      }))
       : [],
    },
  ];


  
  // Conditionally add the "See All" option if there are more than 3 items
  if (items && items.length > 2) {
    data.push({
      title: "See All",
      url: "/dashboard/historyhumanizer",
      items: [],
      key: "see-all-historyhumanizer", // Unique key for this "See All" item
    });
  }
  
  // data.push({
  //   title: "Generate",
  //   url: "/dashboard/generate",
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
  //     <g clipPath="url(#clip0_937_668)">
  //       <path d="M15.7507 3.78017L12.3608 0.57315C12.0003 0.232029 11.5283 0.0441895 11.032 0.0441895H4.57812C3.51194 0.0441895 2.64453 0.9116 2.64453 1.97778V16.1106C2.64453 17.1768 3.51194 18.0442 4.57812 18.0442H14.4219C15.4881 18.0442 16.3555 17.1768 16.3555 16.1106V5.18481C16.3555 4.65574 16.135 4.14376 15.7507 3.78017ZM14.7264 4.26294H12.1016C12.0046 4.26294 11.9258 4.18408 11.9258 4.08716V1.61342L14.7264 4.26294ZM14.4219 16.9895H4.57812C4.0935 16.9895 3.69922 16.5952 3.69922 16.1106V1.97778C3.69922 1.49315 4.0935 1.09888 4.57812 1.09888H10.8711V4.08716C10.8711 4.76564 11.4231 5.31763 12.1016 5.31763H15.3008V16.1106C15.3008 16.5952 14.9065 16.9895 14.4219 16.9895Z" fill="#F4F4F5"/>
  //       <path d="M13.2617 7.07544H5.52734C5.23611 7.07544 5 7.31155 5 7.60278C5 7.89402 5.23611 8.13013 5.52734 8.13013H13.2617C13.553 8.13013 13.7891 7.89402 13.7891 7.60278C13.7891 7.31155 13.553 7.07544 13.2617 7.07544Z" fill="#F4F4F5"/>
  //       <path d="M13.2617 9.88794H5.52734C5.23611 9.88794 5 10.124 5 10.4153C5 10.7065 5.23611 10.9426 5.52734 10.9426H13.2617C13.553 10.9426 13.7891 10.7065 13.7891 10.4153C13.7891 10.124 13.553 9.88794 13.2617 9.88794Z" fill="#F4F4F5"/>
  //       <path d="M8.08391 12.7004H5.52734C5.23611 12.7004 5 12.9365 5 13.2278C5 13.519 5.23611 13.7551 5.52734 13.7551H8.08391C8.37514 13.7551 8.61125 13.519 8.61125 13.2278C8.61125 12.9365 8.37514 12.7004 8.08391 12.7004Z" fill="#F4F4F5"/>
  //     </g>
  //     <defs>
  //       <clipPath id="clip0_937_668">
  //         <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)"/>
  //       </clipPath>
  //     </defs>
  //   </svg>
  //   ),
  //   isActive: true,
  //   items: generatorHistory && generatorHistory.length ? generatorHistory.slice(0, 3).map((history,index) => ({
  //     key: history.createdAt,
  //     // title: truncateText(history.text, 2), // Truncate to 10 word
  //     title: history.text,
  //     createdId: history.createdAt,
  //   })) : [],
  // });










  

  // if (items && items.length > 2) {
  //   data.push({
  //     title: "See All",
  //     url: "/dashboard/historygenerate",
  //     items: [],
  //     key: "see-all-historygenerate", // Unique key for this "See All" item
  //   });
  // }
  
  

   const router = useRouter()

   // Define the saveKey function to save the keyword and navigate
  const saveKeyAndNavigate = (subItem, item) => {
    // First, save to localStorage
    localStorage.setItem('keyword', JSON.stringify({
      title: subItem.title,
      createdId: subItem.createdId
    }));
  
    // Then use setTimeout to defer the navigation and state updates
    setTimeout(() => {
      if(item.title === "Generate") {
        
        router.push('/dashboard/generate');
        if (updategneinfo) updategneinfo();
        
      } else {
        router.push('/dashboard/humanizer');
        if (updateinfo) updateinfo();
      }
    }, 1000);
  };



  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item, index) => (
          <Collapsible  key={item.key || `${item.title}-${index}`}  asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url || "#"}>
                  {React.isValidElement(item.icon) ? (
                    item.icon // If icon is an inline SVG, render directly
                  ) : (
                    item.icon && <item.icon /> // If icon is a component, render as a component
                  )}
                  <span>{item.title}</span>
                 
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem, idx) => (
                        <SidebarMenuSubItem key={idx}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url || "#"}>
                             
                              <div  onClick={() => saveKeyAndNavigate(subItem, item)} 
                                style={{ cursor: 'pointer', textTransform: 'capitalize', wordBreak:'break-word' }}>
   
   {subItem.title
    ? subItem.title.split(' ').slice(0, 2).join(' ') + (subItem.title.split(' ').length > 2 ? '...' : '')
    : 'No Title'}
                                  </div>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
