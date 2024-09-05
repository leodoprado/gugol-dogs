import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { WebSocket } from 'ws'
import { z } from 'zod'

import { getProject } from '@/cache/projects/get-project'
import { setProject } from '@/cache/projects/set-project'
import {
  addClientToProject,
  getClientsByProject,
  removeClientFromProject,
} from '@/ws/project-connections'

import { auth } from '../../middlewares/auth'

export async function editProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug/edit',
      {
        websocket: true,
        schema: {
          tags: ['projects'],
          summary: 'Edit project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
        },
      },
      async (connection, request) => {
        const { projectSlug } = request.params

        addClientToProject(projectSlug, connection)

        const project = (await getProject(projectSlug)) || ''

        connection.send(project)

        connection.on('message', async (message: string) => {
          await setProject(projectSlug, message.toString())
          const clients = getClientsByProject(projectSlug)
          if (!clients) return
          for (const client of clients) {
            if (client !== connection && client.readyState === WebSocket.OPEN) {
              client.send(message.toString())
            }
          }
        })

        connection.on('close', async () => {
          removeClientFromProject(projectSlug, connection)
        })
      },
    )
}
