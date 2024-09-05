import { redis } from '@/lib/redis'

export async function deleteProject(projectSlug: string) {
  return await redis.del(`project:${projectSlug}`)
}
