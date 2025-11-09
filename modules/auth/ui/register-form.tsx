"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import React from 'react'
import {Input} from "@/components/ui/input"
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";

const registerSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'min characters for password is 1'),
    confirmPassword: z.string().min(1, 'min characters for password is 1'),

}).refine(values => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        console.log(values);
        const {error, data} = await authClient.signIn.email({email: values.email, password: values.password});
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Get Started
                    </CardTitle>
                    <CardDescription>
                        Create your account to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 bg-background"
                                                placeholder="devtools@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs"/>
                                    </FormItem>
                                )}
                                name="email"
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 bg-background"
                                                placeholder="********"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs"/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 bg-background"
                                                placeholder="********"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs"/>
                                    </FormItem>
                                )}
                            />
                            <div className="grid  gap-4">
                                <Button variant='outline' disabled={isPending}>
                                    <Image src="/icons/github.svg" alt='github' width={19} height={19}
                                           className="mr-2"/>
                                    Continue with Github</Button>
                                <Button variant='outline' disabled={isPending}>
                                    <Image src="/icons/google.svg" alt='google' width={19} height={19}
                                           className="mr-2"/>
                                    Continue with Google</Button>
                                <Button variant='outline' disabled={isPending}>
                                    <Image src="/icons/apple.svg" alt='github' width={19} height={19} className="mr-2"/>
                                    Continue with Apple</Button>
                            </div>
                            <Button isLoading={isPending} className="h-9 w-full text-sm" type="submit">
                                Sign In
                            </Button>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link className='text-primary underline underline-offset-4' href="/login">Login
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
