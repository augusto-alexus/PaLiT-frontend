import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveRequest, getAllRequests, getRequests, rejectRequest } from '~/backend'
import { useCurrentUser, useErrorHandler } from '~/hooks'

export function useAllHoDRequests() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['allHoDRequests'],
        queryFn: () => getAllRequests(),
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useInvitations() {
    const errorHandler = useErrorHandler()
    const { role } = useCurrentUser()
    const query = useQuery(['requests'], () => getRequests(role))
    if (query.isError) errorHandler(query.error)
    return query
}

export function useRejectInvitation(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ requestId }: { requestId: number }) => rejectRequest(requestId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            onSuccess?.()
        },
        onError: errorHandler,
    })
}

export function useAcceptInvitation(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
    const { role } = useCurrentUser()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ requestId }: { requestId: number }) => approveRequest(requestId, role),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            await queryClient.invalidateQueries(['myProject'])
            onSuccess?.()
        },
        onError: errorHandler,
    })
}
