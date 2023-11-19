import { useQuery } from '@tanstack/react-query'
import { getAllRequests } from '~/backend/hod.ts'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'

export function useAllHoDRequests() {
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    return useQuery({
        enabled: role === 'HoD',
        queryKey: ['allHoDRequests'],
        queryFn: () => getAllRequests(accessToken),
    })
}
