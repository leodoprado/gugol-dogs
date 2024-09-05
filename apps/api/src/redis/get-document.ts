import { cache } from './index'

export async function getDocument(documentId: string) {
  return await cache.get(`document:${documentId}`)
}
