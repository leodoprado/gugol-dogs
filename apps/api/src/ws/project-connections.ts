import { WebSocket } from 'ws'

const clientsByProject: Map<string, Set<WebSocket>> = new Map()

export function addClientToProject(projectId: string, ws: WebSocket) {
  let clientsSet = clientsByProject.get(projectId)
  if (!clientsSet) {
    clientsSet = new Set<WebSocket>()
    clientsByProject.set(projectId, clientsSet)
  }
  clientsSet.add(ws)
}

export function removeClientFromProject(projectId: string, ws: WebSocket) {
  const clientsSet = clientsByProject.get(projectId)
  if (clientsSet) {
    clientsSet.delete(ws)

    if (clientsSet.size === 0) {
      clientsByProject.delete(projectId)
    }
  }
}

export function getClientsByProject(
  projectId: string,
): Set<WebSocket> | undefined {
  return clientsByProject.get(projectId)
}
