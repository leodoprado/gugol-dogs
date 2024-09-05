import { redis } from '@/lib/redis'

export async function getProject(projectSlug: string) {
  return await redis.get(`project:${projectSlug}`)
}
