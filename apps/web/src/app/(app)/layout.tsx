import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
