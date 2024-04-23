import { useQuery } from '@tanstack/react-query'
import { getComments, RequiredValueMissingError } from '~/backend'
import { useErrorHandler } from '~/hooks/error.ts'

export function useGetComments(documentId?: string) {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: !!documentId,
        queryKey: ['documentComments', documentId],
        queryFn: () => {
            if (documentId) return getComments(documentId)
            throw new RequiredValueMissingError('documentId')
        },
    })
    if (query.isError) errorHandler(query.error)
    return query
}
