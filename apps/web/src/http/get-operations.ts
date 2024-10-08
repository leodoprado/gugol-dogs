import { api } from './api-client'

interface GetOperationsResponse {
  operations: {
    id: string
    index: number
    chars: string
    projectId: string
    type: 'insert' | 'delete'
    createdAt: Date
  }[]
}

export async function getOperations(org: string, projectSlug: string) {
  const result = await api
    .get(`organizations/${org}/projects/${projectSlug}/operations`)
    .json<GetOperationsResponse>()

  return result
}
