import React, {PropsWithChildren} from 'react'

export default function AuthLayout(props:PropsWithChildren) {
    return (
        <main className='flex items-center justify-center h-screen'>{props.children}</main>
    )
}
