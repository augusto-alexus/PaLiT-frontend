import { useQuery } from '@tanstack/react-query'
import { getAllUsers, getUserById } from '~/backend'

export function useAllUsers() {
    const { data: users, ...rest } = useQuery({
        queryFn: getAllUsers,
        queryKey: ['users'],
    })
    return { users, ...rest }
}

export function useUserById(id: string | undefined) {
    const { data: user, ...rest } = useQuery({
        enabled: !!id,
        queryFn: () => {
            if (id) return getUserById(id)
        },
        queryKey: ['user', id],
    })
    return { user, ...rest }
}
