"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Import ShadCN toast

export function SignUpForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast(); // Initialize ShadCN toast

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = (password) =>
      /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/.test(password);
    if (!firstname) {
      toast({
        title: "Invalid Field",
        description: "First name cannot be empty.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!lastname) {
      toast({
        title: "Invalid Field",
        description: "Last name cannot be empty.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!isEmailValid(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (!password) {
      toast({
        title: "Invalid Field",
        description: "Password cannot be empty.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 5 characters long and include at least one uppercase letter, one number, and one special character.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const postData = {
      firstname,
      lastname,
      email,
      password,
      temporary: true,
      auth: false,
      subscription: [],
      social: false,
      plan_id: -1,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to create user";
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();
      localStorage.setItem("name", firstname + " " + lastname);
      localStorage.getItem("plan_id", 0);
      toast({
        title: "Sign Up Successful..",
        description: "Please verify your Email" || "Welcome!",
      });
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setSuccess(!success);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const socialPostFunc = async () => {
  //   await fetch("/api/users", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       /* Include required data */
  //     }),
  //   });
  // };

  useEffect(() => {
    if (session?.user?.name) {
      socialPostFunc();
      localStorage.setItem("userSession", JSON.stringify(session));
    } else {
      localStorage.removeItem("userSession");
    }
  }, [session]);

  // const handleSocial = async (event) => {
  //   event.preventDefault();
  //   console.log("Handling social sign up");
  //   await signIn("google", { redirect: false });
  // };


  const handleSocial = async (event) => {
    event.preventDefault();
    console.log("we are in handle social function");
    await signIn('google');
  };

  const socialPostFunc = async (email) => {
    const body = {
      social: true,
      email: email
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json(); // Await the JSON response
      // console.log("This is socialPost func", data);
      localStorage.setItem("plan_id", data.plan_id);
      localStorage.setItem("my_prompt", data.prompt || 0);
      localStorage.setItem("email", data.email);
      localStorage.setItem("image", data?.image);
      localStorage.setItem('userId', data.id);
      localStorage.setItem("name", data?.firstname + " " + data?.lastname);


      localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        router.push("/dashboard")

    } else {
      // console.error("Error in posting social data", , );
      console.log("Error in posting social data", res.status, res.statusText)

    }
  };


  useEffect(() => {
    if(!session){
      return
    }
    if (session?.user?.name) {
      console.log("Session data:", session);
      
      socialPostFunc();
      localStorage.setItem('userSession', JSON.stringify(session));


      setTimeout(() => {
        // router.push("/dashboard/account");
      }, 1000);
    } else {
      localStorage.removeItem('userSession');
    }
  }, [session]);





































  return (
    <>
  

    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="text">First Name</Label>
            <Input
              id="text"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Enter First Name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Last Name</Label>
            <Input
              id="text"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter Last Name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleSocial}>
            Sign Up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
