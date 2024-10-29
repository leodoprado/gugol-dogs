'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOperations } from '@/http/get-operations'

export function History() {
  const { project, slug } = useParams<{ slug: string; project: string }>()
  const { data } = useQuery({
    queryKey: ['operations'],
    queryFn: () => {
      return getOperations(slug, project)
    },
  })

  return (
    <SheetHeader>
      <SheetTitle>Histórico de operações</SheetTitle>
      <SheetDescription>
        <Table>
          <ScrollArea className="h-screen">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Operação</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Texto</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.operations.map((operation) => {
                return (
                  <TableRow key={operation.id}>
                    <TableCell className="w-[100px]">
                      {operation.type === 'insert' ? 'Inserido ' : 'Deletado '}
                    </TableCell>
                    <TableCell className="text-right">
                      {operation.index}
                    </TableCell>
                    <TableCell>{operation.chars}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </ScrollArea>
        </Table>
      </SheetDescription>
    </SheetHeader>
  )
}
