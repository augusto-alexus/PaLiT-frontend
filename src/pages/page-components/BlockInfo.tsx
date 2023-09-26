import { useQuery } from '@tanstack/react-query'
import { getMyProject } from '~/backend'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { InfoRow } from './InfoRow.tsx'

export function BlockInfo() {
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
                infoKey={isTeacher ? 'Викладач' : 'Студент'}
                value={currentUser.lastName + ' ' + currentUser.firstName}
            />
            <InfoRow
                infoKey='Куратор'
                value={
                    data?.advisor?.lastName && data?.advisor?.firstName
                        ? data.advisor.lastName + ' ' + data.advisor.firstName
                        : undefined
                }
                editable
                createPrompt='Вибрати куратора'
                iconR={
                    <a
                        onClick={() => alert('Змінити куратора')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow
                infoKey='Мова'
                value={data?.language}
                editable
                createPrompt='Вибрати мову'
                iconR={
                    <a
                        onClick={() => alert('Змінити мову')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow
                infoKey='Тема'
                value={data?.theme}
                editable
                createPrompt='Вибрати тему'
                iconR={
                    <a
                        onClick={() => alert('Вибрати тему')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            {/*<InfoRow*/}
            {/*    infoKey='Статус'*/}
            {/*    iconL={*/}
            {/*        <div className='mr-1 h-6 w-6 rounded-[5px] bg-cs-additional-green text-center text-cs-text-light'>*/}
            {/*            <i className='ri-check-fill'></i>*/}
            {/*        </div>*/}
            {/*    }*/}
            {/*/>*/}
        </div>
    )
}
