'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

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

export function ChangePassword() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [success, setSuccess] = useState('');

  const route = useRouter();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    // Validate input fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required!',
        variant: 'error',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'New password and confirm password do not match!',
        variant: 'error',
      });
      return;
    }

    const postData = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Server response was not in JSON format');
      }

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to change password';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Success',
        description: result.message || 'Password changed successfully!',
        variant: 'success',
      });

      setSuccess(result.message);
      setTimeout(() => {
        route.push("/dashboard");
      }, 1000);

      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error:', error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>Enter your current and new passwords</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="currentPassword">Current Password</Label>
              </div>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="newPassword">New Password</Label>
              </div>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              </div>
              <Input
                id="confirmNewPassword"
                type={showPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>

            <Button type="button" className="w-full" onClick={() => route.push("/dashboard")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
