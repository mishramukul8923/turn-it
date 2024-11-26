"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
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
import { useToast } from "@/hooks/use-toast"; // Import ShadCN toast



export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter(); // Initialize router
  const { toast } = useToast(); // Initialize ShadCN toast

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast({
        title: "Invalid Input",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }

    const postData = { email };

    try {
      const response = await fetch('/api/forgetPass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to submit request';

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: result.message || 'Password reset link sent successfully!',
        variant: 'success',
        style: {
          backgroundColor: "black",
        }
      });

      setEmail('');
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <>
  
 
    <Card className="mx-auto max-w-sm turnitfgt">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>Enter your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>

          <Button
            type="button"
            className="w-full"
            variant="secondary"
            onClick={handleCancel} // Redirects to home page
          >
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
     </>
  );
}
