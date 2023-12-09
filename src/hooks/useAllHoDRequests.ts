import { useQuery } from '@tanstack/react-query'
import { getAllRequests } from '~/backend/hod.ts'
import { useAccessToken } from './useAccessToken'
import { useCurrentUser } from './useCurrentUser'

export function useAllHoDRequests() {
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    return useQuery({
        enabled: role === 'HoD',
        queryKey: ['allHoDRequests'],
        queryFn: () => getAllRequests(accessToken),
    })
}
