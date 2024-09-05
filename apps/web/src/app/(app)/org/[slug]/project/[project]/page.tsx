'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { editProject } from '@/ws/edit-project'

export default function Projects() {
  const [content, setContent] = useState<string>('')

  const [isTyping, setIsTyping] = useState(false)

  const { project, slug } = useParams<{
    slug: string
    project: string
  }>()

  useEffect(() => {
    const ws = editProject({
      orgSlug: slug,
      projectSlug: project,
    })

    ws.onmessage = (event: MessageEvent) => {
      setContent(event.data)
    }

    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    if (!isTyping) return

    const timer = setTimeout(() => {
      executarFuncao()
      setIsTyping(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [content])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
    setIsTyping(true)
  }
  const executarFuncao = () => {
    const ws = editProject({
      orgSlug: slug,
      projectSlug: project,
    })

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
    </div>
  )
}
