import { useQuery } from '@tanstack/react-query'
import { getMyProject } from '~/backend'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { InfoRow } from './InfoRow.tsx'

export function ProjectInfo() {
    const currentUser = useCurrentUser()
    const isTeacher = currentUser.role === 'teacher'
    const accessToken = useAccessToken()
    const { data } = useQuery({
        enabled: !isTeacher,
        queryKey: ['myProject'],
        queryFn: () => getMyProject(accessToken),
    })

    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey='Куратор'
                value={
                    data?.advisor?.lastName && data?.advisor?.firstName
                        ? data.advisor.lastName + ' ' + data.advisor.firstName
                        : undefined
                }
            />
            <InfoRow infoKey='Мова' value={data?.language} />
            <InfoRow infoKey='Тема' value={data?.theme} />
        </div>
    )
}
