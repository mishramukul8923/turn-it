'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";




export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast(); // Using ShadCN toast

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    // Validation: Check for empty fields
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const postData = { email, password };
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to log in');
      }

      localStorage.setItem("plan_id", result.plan_id);
      localStorage.setItem("my_prompt", result.prompt || 0);
      localStorage.setItem("email", postData.email);
      localStorage.setItem("image", result?.image);
      localStorage.setItem('userId', result.id);
      localStorage.setItem("name", result?.firstname + " " + result?.lastname);

      toast({
        title: "Welcome!",
        description: result.message || "Login successful!",
      });

      setTimeout(() => {
        router.push("/dashboard/humanizer");
      }, 1000);

      if (result.token) {
        localStorage.setItem('token', result.token);
        document.cookie = `token=${result.token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      } else {
        console.error('Login successful, but no token received');
      }
    } catch (error) {
      // console.error('Error:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (event) => {
    event.preventDefault();
    console.log("we are in handle social function");
    await signIn('google', { redirect: false });
  };

  const socialPostFunc = async () => {
    await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Include any required data for your POST request
      }),
    });
  };

  useEffect(() => {
    if (session?.user?.name) {
      console.log("Session data:", session);
      socialPostFunc();
      localStorage.setItem('userSession', JSON.stringify(session));

      setTimeout(() => {
        router.push("/dashboard/dashaccount");
      }, 1000);
    } else {
      localStorage.removeItem('userSession');
    }
  }, [session]);

  return (

    <>
 

    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgotpassword" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleSocial}>
            Login with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
    </>
  );
}