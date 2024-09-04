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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
    const ws = editProject({
      orgSlug: slug,
      projectSlug: project,
    })

    ws.onopen = () => {
      ws.send(event.target.value)
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
