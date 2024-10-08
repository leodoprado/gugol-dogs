import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  content: string | null
}

type CreateProjectResponse = void

export async function createProject({
  org,
  name,
  content,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post(`organizations/${org}/projects`, {
    json: {
      name,
      content,
    },
  })
}
