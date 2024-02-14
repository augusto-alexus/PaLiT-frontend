import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { approveRequest, getAllRequests, getRequests, rejectRequest } from '~/backend'
import { toast } from '~/components'
import { useCurrentUser } from '~/hooks'

export function useAllHoDRequests() {
    const { role } = useCurrentUser()
    return useQuery({
        enabled: role === 'HoD',
        queryKey: ['allHoDRequests'],
        queryFn: () => getAllRequests(),
    })
}

export function useInvitations() {
    const { role } = useCurrentUser()
    return useQuery(['requests'], () => getRequests(role))
}

export function useRejectInvitation(onSuccess?: () => void) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ requestId }: { requestId: number }) => rejectRequest(requestId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            onSuccess?.()
        },
    })
}

export function useAcceptInvitation(onSuccess?: () => void) {
    const { role } = useCurrentUser()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: ({ requestId }: { requestId: number }) => approveRequest(requestId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            await queryClient.invalidateQueries(['myProject'])
            onSuccess?.()
        },
        onError: (error) => {
            console.log('===>', error)
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    toast(`${t('error.studentAlreadyHasTeacher')}!`)
                } else if (error.response?.status === 403) {
                    if (role === 'student') toast(`${t('error.inviteLimitTeacher')}!`)
                    else toast(`${t('error.inviteLimitYou')}!`)
                } else {
                    toast(`${t('unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('unknownError')}!`)
            }
        },
    })
}
