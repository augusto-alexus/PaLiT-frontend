import { useQuery } from '@tanstack/react-query'
import { getAllTeachers, getMyStudents } from '~/backend'
import { useCurrentUser } from '~/hooks/auth.ts'
import { useErrorHandler } from '~/hooks/error.ts'

export function useAllTeachers() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useMyStudents() {
    const { role } = useCurrentUser()
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: role !== 'student',
        queryKey: ['myStudents'],
        queryFn: getMyStudents,
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useMyStudent(studentId?: string | null) {
    const { role } = useCurrentUser()
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents', studentId],
        queryFn: async () => {
            const myStudents = await getMyStudents()
            return myStudents?.find((s) => s.student.studentId.toString() === studentId)
        },
    })
    if (query.isError) errorHandler(query.error)
    return query
}
