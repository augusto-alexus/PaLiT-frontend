import { useQuery } from '@tanstack/react-query'
import { getAllTeachers } from '~/backend'

export function useAllTeachers() {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })
}
