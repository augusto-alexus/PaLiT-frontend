import { useQuery } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import { getMyProject } from '~/backend'
import { useCurrentUser } from '~/hooks'
import { IMyStudent } from '~/models'

export function useTeamInfo() {
    const currentUser = useCurrentUser()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()
    const {
        data: myProject,
        isLoading,
        isFetching,
    } = useQuery({
        enabled: currentUser.role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(),
    })

    const advisorTmp = myProject?.advisor
    const advisor = advisorTmp
        ? {
              teacherId: advisorTmp?.id,
              firstName: advisorTmp?.firstName,
              lastName: advisorTmp?.lastName,
          }
        : undefined

    const teacher = advisor || currentUser
    const student = outletContext?.myStudent?.student || currentUser
    return {
        isLoading: isLoading && isFetching,
        teacher,
        student,
    }
}
