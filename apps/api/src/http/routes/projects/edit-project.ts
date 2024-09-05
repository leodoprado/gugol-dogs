import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { WebSocket } from 'ws'
import { z } from 'zod'

import { getDocument } from '@/redis/get-document'
import { setDocument } from '@/redis/set-document'

import { auth } from '../../middlewares/auth'

const clients: Set<WebSocket> = new Set()

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

        clients.add(connection)
        const document = (await getDocument(projectSlug)) || ''

        connection.send(document)

        connection.on('message', async (message: string) => {
          console.log(message.toString())
          await setDocument(projectSlug, message.toString())
          for (const client of clients) {
            if (client !== connection && client.readyState === WebSocket.OPEN) {
              client.send(message.toString())
            }
          }
        })
      },
    )
}
