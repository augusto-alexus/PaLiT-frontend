import { useQuery } from '@tanstack/react-query'
import { getAllStudents, getAllStudentsWithInfo, getMyProject, IMyProject } from '~/backend'
import { useCurrentUser, useErrorHandler } from '~/hooks'

export function useAllStudents() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['students'],
        queryFn: getAllStudents,
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useAllStudentsWithInfo() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['studentsWithInfo'],
        queryFn: getAllStudentsWithInfo,
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useStudent(studentId: string | null | undefined) {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: !!studentId,
        queryKey: ['student', studentId],
        queryFn: async () => {
            const allStudents = await getAllStudents()
            return allStudents.find((s) => s.studentId.toString() === studentId)
        },
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useMyProject(): IUseMyProject {
    const errorHandler = useErrorHandler()
    const { role } = useCurrentUser()
    const query = useQuery({
        enabled: role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(),
    })
    if (query.isError) errorHandler(query.error)
    const { data: myProject, isInitialLoading } = query
    const myProjectStarted = !!myProject?.advisor.id
    return Object.freeze({
        myProject,
        myProjectStarted,
        isInitialLoading,
    })
}

interface IUseMyProject {
    myProject: IMyProject | undefined
    myProjectStarted: boolean
    isInitialLoading: boolean
}
