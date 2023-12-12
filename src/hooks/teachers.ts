import { useQuery } from '@tanstack/react-query'
import { getAllTeachers, getMyStudents } from '~/backend'
import { useAccessToken, useCurrentUser } from '~/hooks'

export function useAllTeachers() {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })
}

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
