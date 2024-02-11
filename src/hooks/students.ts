import { useQuery } from '@tanstack/react-query'
import { getAllStudents, getMyProject, IMyProject } from '~/backend'
import { useCurrentUser } from '~/hooks'

export function useAllStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: getAllStudents,
    })
}

export function useStudent(studentId: string) {
    return useQuery({
        queryKey: ['student', studentId],
        queryFn: async () => {
            const allStudents = await getAllStudents()
            return allStudents.find((s) => s.studentId.toString() === studentId)
        },
    })
}

export function useMyProject(): IUseMyProject {
    const currentUser = useCurrentUser()
    const { data: myProject } = useQuery({
        enabled: currentUser.role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(),
    })

    const myProjectStarted = !!myProject?.advisor.id

    return Object.freeze({
        myProject,
        myProjectStarted,
    })
}

interface IUseMyProject {
    myProject: IMyProject | undefined
    myProjectStarted: boolean
}
