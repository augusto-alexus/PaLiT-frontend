import { useQuery } from '@tanstack/react-query'
import { getMyStudents } from '~/backend'
import { useAccessToken } from './useAccessToken'
import { useCurrentUser } from './useCurrentUser'

export function useMyStudent(studentId: string | number | undefined) {
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    const { data: myStudents, isLoading } = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents', studentId],
        queryFn: () => getMyStudents(accessToken),
    })
    return {
        myStudent: myStudents?.find((s) => s.student.studentId == studentId),
        isLoading,
    }
}
