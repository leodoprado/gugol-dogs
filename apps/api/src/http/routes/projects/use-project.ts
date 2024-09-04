import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { WebSocket } from 'ws'
import { z } from 'zod'

// import { auth } from '../../middlewares/auth'
const clients: Set<WebSocket> = new Set()

export async function useProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    // .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug/use',
      {
        websocket: true,
        schema: {
          tags: ['projects'],
          summary: 'Get project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
        },
      },
      (connection) => {
        clients.add(connection)

        connection.on('message', (message: string) => {
          console.log(message.toString())
          for (const client of clients) {
            if (client !== connection && client.readyState === WebSocket.OPEN) {
              client.send(message.toString())
            }
          }
        })
      },
    )
}
