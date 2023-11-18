import { useQuery } from '@tanstack/react-query'
import { getMyProject, IMyProject } from '~/backend'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'

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
