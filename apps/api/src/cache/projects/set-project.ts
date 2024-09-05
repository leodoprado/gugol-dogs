import { redis } from '@/lib/redis'

export async function setProject(projectSlug: string, content: string) {
  return await redis.set(`project:${projectSlug}`, content, 'EX', 60 * 15)
}
