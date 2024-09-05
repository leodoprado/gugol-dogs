import { cache } from './index'

export async function deletDocument(documentId: string) {
  return await cache.del(`document:${documentId}`)
}
