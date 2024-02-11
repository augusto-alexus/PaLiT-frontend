import { useQuery } from '@tanstack/react-query'
import { getAllTeachers, getMyStudents } from '~/backend'
import { useCurrentUser } from '~/hooks'

export function useAllTeachers() {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })
}

export function useTeacher(teacherId: string) {
    return useQuery({
        queryKey: ['teacher', teacherId],
        queryFn: async () => {
            const allTeachers = await getAllTeachers()
            return allTeachers.find((t) => t.teacherId.toString() === teacherId)
        },
    })
}

export function useMyStudent(studentId: string | number | undefined) {
    const { role } = useCurrentUser()
    const { data: myStudents, isLoading } = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents', studentId],
        queryFn: () => getMyStudents(),
    })
    return {
        myStudent: myStudents?.find((s) => s.student.studentId == studentId),
        isLoading,
    }
}
