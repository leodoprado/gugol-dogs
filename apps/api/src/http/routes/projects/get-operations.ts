import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { auth } from '../../middlewares/auth'

export async function getOperations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug/operations',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get project operations',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              operations: z.array(
                z.object({
                  id: z.string().uuid(),
                  index: z.number(),
                  chars: z.string(),
                  projectId: z.string(),
                  type: z.enum(['insert', 'delete']),
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { projectSlug } = request.params

        const operations = await prisma.operation.findMany({
          where: {
            project: { slug: projectSlug },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.send({ operations })
      },
    )
}
