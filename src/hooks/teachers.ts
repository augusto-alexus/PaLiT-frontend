import { useQuery } from '@tanstack/react-query'
import { getAllTeachers, getMyStudents } from '~/backend'

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

export function useMyStudents() {
    return useQuery({
        queryKey: ['myStudents'],
        queryFn: getMyStudents,
    })
}

export function useMyStudent(studentId?: string | null) {
    return useQuery({
        queryKey: ['myStudents', studentId],
        queryFn: async () => {
            const myStudents = await getMyStudents()
            return myStudents?.find((s) => s.student.studentId.toString() === studentId)
        },
    })
}
