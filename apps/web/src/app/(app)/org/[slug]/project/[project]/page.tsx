'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { editProject } from '@/ws/edit-project'

export default function Projects() {
  const [content, setContent] = useState<string>('')

  const { project, slug } = useParams<{
    slug: string
    project: string
  }>()

  useEffect(() => {
    const ws = editProject({ orgSlug: slug, projectSlug: project })

    const handleMessage = (event: MessageEvent) => {
      setContent(event.data)
    }

    ws.addEventListener('message', handleMessage)

    return () => {
      ws.removeEventListener('message', handleMessage)
      ws.close()
    }
  }, [slug, project])

  const submitEdit = (content: string) => {
    const ws = editProject({ orgSlug: slug, projectSlug: project })

    ws.addEventListener('open', () => {
      ws.send(content)
      ws.close()
    })

    return () => ws.removeEventListener('open', () => {})
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value
    setContent(newContent)
    submitEdit(newContent)
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
