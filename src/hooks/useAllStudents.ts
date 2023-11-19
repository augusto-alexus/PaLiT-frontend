import { useQuery } from '@tanstack/react-query'
import { getAllStudents } from '~/backend'

export function useAllStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: getAllStudents,
    })
}
