import { useQuery } from '@tanstack/react-query'
import { getComments } from '~/backend'

export function useGetComments(documentId?: string) {
    return useQuery({
        enabled: !!documentId,
        queryKey: ['documentComments', documentId],
        queryFn: () => {
            if (documentId) return getComments(documentId)
            throw new Error("Can't get documents without 'documentId'")
        },
    })
}
