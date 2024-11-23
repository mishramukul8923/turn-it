'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useMemo } from "react";
import styles from './dashboard.module.css'
export function NavUser({ user }) {

  const { isMobile } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();

  const logout = async () => {
    document.cookie = "token=; path=/;"; // Clear the token cookie
    const email = user?.email; // Access the email from the user object

    try {
      // Send logout request to the backend to save the logout time
      const result = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), // Send the email or other identifier of the user
      });

      if (result.ok) {
        localStorage.clear(); // Clear the token from local storage
        // Show a success notification using shadcn
        toast({
          title: 'Success',
          description: 'Logged out successfully!',
          variant: 'success',
        });

        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/'); // Redirect to homepage or login page
        }, 2000);
      }

    } catch (error) {
      // Show an error notification using shadcn
      toast({
        title: 'Error',
        description: 'Error logging out. Please try again.',
         variant: "destructive",
      });
    }
  };
  // name initals in image
  const getInitials = useMemo(() => {
    if (user?.name || user?.firstname || user?.lastname) {
      let firstNameInitial = '';
      let lastNameInitial = '';

      if (user.name) {
        const nameParts = user.name.split(" ");
        firstNameInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
        lastNameInitial = nameParts[1]?.charAt(0).toUpperCase() || ''; // Handles case with two parts (first and last)
      } else if (user.firstname && user.lastname) {
        firstNameInitial = user.firstname[0]?.toUpperCase() || '';
        lastNameInitial = user.lastname[0]?.toUpperCase() || '';
      } else if (user.firstname) {
        firstNameInitial = user.firstname[0]?.toUpperCase() || '';
      } else if (user.lastname) {
        firstNameInitial = user.lastname[0]?.toUpperCase() || '';
      }
      return (firstNameInitial + lastNameInitial)
    }

    return '';
  }, [user]);



  // const handleRemoveCookie = () => {
  //   document.cookie = "token=; path=/;";
  //   console.log("Token cookie removed! Check in the browser.");
  //   router.push('/');
  // };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className={styles.profileInitial}>
                    {getInitials || "U"} {/* Show initials, fallback to "U" if unavailable */}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user ? `${user?.name}` : 'Name not available'}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className={styles.profileInitial}>
                      {getInitials || "U"} {/* Show initials, fallback to "U" if unavailable */}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user ? `${user?.name}` : 'Name not available'}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  <Link href="/dashboard/pricing-plan">Upgrade to Pro</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BadgeCheck />
                  <Link href="/dashboard/dashaccount">Account</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>


            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* <button onClick={handleRemoveCookie}>
        Remove Token Cookie
      </button> */}

    </>
  );
}
