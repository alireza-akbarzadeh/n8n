'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { signOut } from '@/lib/auth-client';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Assuming the verification token comes as a query param

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {loading
              ? 'Verifying your email...'
              : verified
                ? 'Your email has been verified!'
                : 'Please check your email for the verification link.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!loading && verified && (
            <Button variant="default" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
