import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
    getAllStages,
    getMyProject,
    IMyProject,
    IMyStudent,
    IStageDTO,
} from '~/backend'
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

    const { data: stages } = useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(accessToken),
    })

    if (myStudent)
        return <TeacherProjectInfo myStudent={myStudent} stages={stages} />
    if (isFetching && isLoading) return <Loading />
    if (myProject)
        return <StudentProjectInfo myProject={myProject} stages={stages} />
    return <></>
}

function TeacherProjectInfo({
    myStudent,
    stages,
}: {
    myStudent: IMyStudent
    stages?: IStageDTO[]
}) {
    const { t } = useTranslation()
    const { student } = myStudent
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey={t('projectInfo.student')}
                value={student.lastName + ' ' + student.firstName}
            />
            <InfoRow
                infoKey={t('projectInfo.degree')}
                value={t(`degrees.${student.degree}`)}
            />
            <InfoRow
                infoKey={t('projectInfo.faculty')}
                value={student.faculty}
            />
            <InfoRow infoKey={t('projectInfo.group')} value={student.cluster} />
            <InfoRow
                infoKey={t('projectInfo.language')}
                value={myStudent.language}
            />
            <InfoRow infoKey={t('projectInfo.theme')} value={myStudent.theme} />
            <InfoRow
                infoKey={t('projectInfo.stage')}
                value={stages && stages[0] ? stages[0].name : undefined}
            />
        </div>
    )
}

function StudentProjectInfo({
    myProject,
    stages,
}: {
    myProject: IMyProject
    stages?: IStageDTO[]
}) {
    const { t } = useTranslation()
    const { advisor } = myProject
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey={t('projectInfo.teacher')}
                value={advisor.lastName + ' ' + advisor.firstName}
            />
            <InfoRow
                infoKey={t('projectInfo.language')}
                value={myProject.language}
            />
            <InfoRow infoKey={t('projectInfo.theme')} value={myProject.theme} />
            <InfoRow
                infoKey={t('projectInfo.stage')}
                value={stages && stages[0] ? stages[0].name : undefined}
            />
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
