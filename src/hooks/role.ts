import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from '~/backend'

export function useAllRoles() {
    return useQuery({
        queryFn: getAllRoles,
        queryKey: ['roles'],
    })
}
