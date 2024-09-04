'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Projects() {
  const [content, setContent] = useState<string>('')
  const { project, slug } = useParams<{
    slug: string
    project: string
  }>()

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:3333/organizations/${slug}/projects/${project}/use`,
    )

    ws.onmessage = (event: MessageEvent) => {
      setContent(event.data)
    }

    return () => {
      ws.close()
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const submitMessage = () => {
    const ws = new WebSocket(
      `ws://localhost:3333/organizations/${slug}/projects/${project}/use`,
    )
    ws.onopen = () => {
      ws.send(content)
      ws.close()
    }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{project}</h1>
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Edit document"
        rows={30}
      />
      <Button onClick={submitMessage}>Enviar</Button>
    </div>
  )
}
