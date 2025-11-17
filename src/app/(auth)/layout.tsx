import React, { PropsWithChildren } from 'react';

export default function AuthLayout(props: PropsWithChildren) {
  return (
    <main className="bg-muted flex h-screen items-center justify-center gap-6 p-6 md:p-10">
      {props.children}
    </main>
  );
}
