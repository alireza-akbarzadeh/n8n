'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from '@/core/auth/auth-client';
import Link from 'next/link';
import { toast } from 'sonner';
import { SocialLogin } from './social-login';
import { PasswordInput } from './password-input';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'min characters for password is 1'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          toast.success('successfully logged in. Welcome back!');
          router.push('/');
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
      }
    );
  }

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Link href="/" className="flex items-center justify-center gap-1 py-3">
            <Image src="/images/logo.svg" alt="logo" width={30} height={30} />
            <span className="text-base">Node Base</span>
          </Link>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <SocialLogin />
              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t" />
                <span className="text-muted-foreground mx-3 text-xs tracking-wider capitalize">
                  or continue with email
                </span>
                <div className="flex-grow border-t" />
              </div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background h-9"
                        placeholder="devtools@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
                name="email"
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="bg-background h-9"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button isLoading={isPending} className="h-9 w-full text-sm" type="submit">
                Sign In
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link className="text-primary underline underline-offset-4" href="/signup">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
