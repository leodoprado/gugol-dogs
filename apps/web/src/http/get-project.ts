import { api } from './api-client'

interface GetProjectsResponse {
  project: {
    content: string
    slug: string
    id: string
    name: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }
}

export async function getProject(org: string, project: string) {
  const result = await api
    .get(`organizations/${org}/projects/${project}`, {
      next: {
        tags: ['project', project],
      },
    })
    .json<GetProjectsResponse>()

  return result
}
