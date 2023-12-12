import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { getAllRequests, updateRequest } from '~/backend'
import { toast } from '~/components'
import { useAccessToken, useCurrentUser } from '~/hooks'

export function useAllHoDRequests() {
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    return useQuery({
        enabled: role === 'HoD',
        queryKey: ['allHoDRequests'],
        queryFn: () => getAllRequests(accessToken),
    })
}

export function useUpdateHodRequest() {
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: async ({
            requestId,
            approved,
        }: {
            requestId: number
            approved: boolean
        }) => updateRequest(accessToken, requestId, approved),
        onSuccess: async ([success, approved]) => {
            if (success) {
                await queryClient.invalidateQueries(['allHoDRequests'])
                if (approved) toast(t('dashboard.requestApproved'))
                else toast(t('dashboard.requestRejected'))
            } else {
                toast(t('dashboard.requestError'))
            }
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}
