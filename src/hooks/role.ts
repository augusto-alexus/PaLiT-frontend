import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from '~/backend'
import { useErrorHandler } from '~/hooks/error.ts'

export function useAllRoles() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryFn: getAllRoles,
        queryKey: ['roles'],
    })
    if (query.isError) errorHandler(query.error)
    return query
}
