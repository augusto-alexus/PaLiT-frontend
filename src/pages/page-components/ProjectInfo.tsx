import { useQuery } from '@tanstack/react-query'
import { getMyProject, IMyProject, IMyStudent } from '~/backend'
import { Loading } from '~/components'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'

export function ProjectInfo({ myStudent }: { myStudent?: IMyStudent }) {
    const { role } = useCurrentUser()
    const accessToken = useAccessToken()
    const {
        data: myProject,
        isLoading,
        isFetching,
    } = useQuery({
        enabled: role === 'student' && !myStudent,
        queryKey: ['myProject'],
        queryFn: () => getMyProject(accessToken),
    })

    if (myStudent) return <TeacherProjectInfo myStudent={myStudent} />
    if (isFetching && isLoading) return <Loading />
    if (myProject) return <StudentProjectInfo myProject={myProject} />
    return <></>
}

function TeacherProjectInfo({ myStudent }: { myStudent: IMyStudent }) {
    const { student } = myStudent
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey='Студент'
                value={student.lastName + ' ' + student.firstName}
            />
            <InfoRow infoKey='Ступінь' value={student.degree} />
            <InfoRow infoKey='Факультет' value={student.faculty} />
            <InfoRow infoKey='Група' value={student.cluster} />
            <InfoRow infoKey='Мова' value={myStudent.language} />
            <InfoRow infoKey='Тема' value={myStudent.theme} />
        </div>
    )
}

function StudentProjectInfo({ myProject }: { myProject: IMyProject }) {
    const { advisor } = myProject
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey='Куратор'
                value={advisor.lastName + ' ' + advisor.firstName}
            />
            <InfoRow infoKey='Мова' value={myProject.language} />
            <InfoRow infoKey='Тема' value={myProject.theme} />
        </div>
    )
}

function InfoRow({ infoKey, value }: { infoKey: string; value?: string }) {
    return (
        <div className='flex flex-row justify-between gap-4 bg-white py-2 align-baseline text-cs-text-dark'>
            <div className='basis-4/12 font-mono'>{infoKey}</div>
            <div className='flex flex-row text-right'>{value || '—'}</div>
        </div>
    )
}
