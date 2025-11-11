import React, {PropsWithChildren} from 'react'

export default function AuthLayout(props:PropsWithChildren) {
    return (
        <main className='flex items-center justify-center h-screen bg-muted gap-6 p-6 md:p-10'>{props.children}</main>
    )
}
