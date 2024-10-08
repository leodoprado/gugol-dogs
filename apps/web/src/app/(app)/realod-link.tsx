'use client'
import React, { MouseEvent } from 'react'

import { Button } from '@/components/ui/button'

interface ReloadLinkProps {
  href: string
  children: React.ReactNode
}

const ReloadLink: React.FC<ReloadLinkProps> = ({ href, children }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = href // Força o recarregamento total da página
  }

  return (
    <Button
      size="lg"
      asChild
      className="transform bg-white text-black transition duration-300 hover:scale-105 hover:bg-gray-200"
    >
      <a href={href} onClick={handleClick}>
        {children}
      </a>
    </Button>
  )
}

export default ReloadLink
