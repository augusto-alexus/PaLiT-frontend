import { useQuery } from '@tanstack/react-query'
import { getAllStudents, getMyProject, IMyProject } from '~/backend'
import { useAccessToken, useCurrentUser } from '~/hooks'

export function useAllStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: getAllStudents,
    })
}

export function useMyProject(): IUseMyProject {
    const accessToken = useAccessToken()
    const currentUser = useCurrentUser()
    const { data: myProject } = useQuery({
        enabled: currentUser.role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(accessToken),
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
