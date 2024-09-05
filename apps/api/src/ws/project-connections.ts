import { WebSocket } from 'ws'

import { getProject } from '@/cache/projects/get-project'
import { setProject } from '@/cache/projects/set-project'

const projects: Map<string, Map<string, WebSocket>> = new Map()

export function addUserToProject(
  projectSlug: string,
  userId: string,
  ws: WebSocket,
) {
  let usersMap = projects.get(projectSlug)
  if (!usersMap) {
    usersMap = new Map<string, WebSocket>()
    projects.set(projectSlug, usersMap)
  }
  usersMap.set(userId, ws)
}

export function removeUserFromProject(projectSlug: string, userId: string) {
  const usersMap = projects.get(projectSlug)
  if (usersMap) {
    usersMap.delete(userId)

    if (usersMap.size === 0) {
      projects.delete(projectSlug)
    }
  }
}

export function getUserWebSocket(
  projectSlug: string,
  userId: string,
): WebSocket | undefined {
  const usersMap = projects.get(projectSlug)
  return usersMap?.get(userId)
}

export function getUsersConnectedProject(
  projectSlug: string,
): Map<string, WebSocket> | undefined {
  return projects.get(projectSlug)
}

// Pegar o projeto do cache e enviar para o usuário
export async function userConnect({
  connection,
  projectSlug,
  userId,
}: {
  projectSlug: string
  userId: string
  connection: WebSocket
}) {
  addUserToProject(projectSlug, userId, connection)

  const project = (await getProject(projectSlug)) || ''

  connection.send(project)
}

// Atualizar o projeto no cache e mandar para todos os usuários connectados nesse projeto
export async function updateProject({
  connection,
  message,
  projectSlug,
}: {
  projectSlug: string
  message: string
  connection: WebSocket
}) {
  await setProject(projectSlug, message)

  const users = getUsersConnectedProject(projectSlug)
  if (!users) return
  for (const user of users) {
    const client = user[1]

    if (client !== connection && client.readyState === WebSocket.OPEN) {
      client.send(message.toString())
    }
  }
}

// remover usuário(websocket) do projeto
export function desconnectUserFromProject(projectSlug: string, userId: string) {
  removeUserFromProject(projectSlug, userId)
}
