import { cache } from './index'

export async function setDocument(documentId: string, content: string) {
  return await cache.set(`document:${documentId}:conn`, content, 'EX', 60 * 15)
}