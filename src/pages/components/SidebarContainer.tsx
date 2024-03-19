import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { IMyStudent } from '~/models'
import { useCurrentUser, useMyProject, useStudent } from '~/hooks'
import { Loading } from '~/components'
import { useSearchParams } from 'react-router-dom'
import { ThemeUpdateForm } from '~/pages/components/ThemeUpdateForm.tsx'

export function SidebarContainer({ children, myStudent }: PropsWithChildren<{ myStudent?: IMyStudent }>) {
    return (
        <div className='mx-auto flex w-10/12 flex-row justify-between'>
            <main className='w-full'>{children}</main>
            <div className='w-1/4 max-w-md overflow-hidden border-s border-cs-additional-gray ps-4'>
                <ProjectInfo language={myStudent?.language} stageName={myStudent?.stage?.name} />
            </div>
        </div>
    )
}

export function ProjectInfo({ language, stageName }: IProjectInfoProps) {
    const { t } = useTranslation()
    const currentUser = useCurrentUser()
    const [searchParams] = useSearchParams()
    let studentId = searchParams.get('studentId')
    if (currentUser.role === 'student') studentId = currentUser?.studentId?.toString() ?? null
    const { data: student, isInitialLoading: isStudentLoading } = useStudent(studentId)
    const { myProject, isInitialLoading: isMyProjectLoading } = useMyProject()

    if (isMyProjectLoading || isStudentLoading) return <Loading />

    const studentFullName = student ? student.lastName + ' ' + student.firstName : undefined
    const studentDegree = student && student.degree ? t(`degrees.${student.degree}`) : undefined
    const teacherFullName = myProject ? myProject.advisor.lastName + ' ' + myProject.advisor.firstName : undefined

    return (
        <div className='flex flex-col gap-2'>
            {currentUser.role !== 'student' && <InfoRow infoKey={t('projectInfo.student')} value={studentFullName} />}
            <InfoRow infoKey={t('projectInfo.teacher')} value={teacherFullName} />
            <InfoRow infoKey={t('projectInfo.degree')} value={studentDegree} />
            <InfoRow infoKey={t('projectInfo.faculty')} value={student?.faculty} />
            <InfoRow infoKey={t('projectInfo.group')} value={student?.cluster} />
            <InfoRow infoKey={t('projectInfo.language')} value={language || myProject?.language} />
            <InfoRow
                infoKey={t('projectInfo.stage')}
                value={
                    stageName
                        ? t(`stages.${stageName}`)
                        : myProject?.stage?.name
                        ? t(`stages.${myProject?.stage?.name}`)
                        : undefined
                }
            />
            {studentId && <ThemeUpdateForm studentId={studentId} />}
        </div>
    )
}

export function InfoRow({ infoKey, value }: { infoKey: string; value?: string }) {
    if (!value) return <></>
    return (
        <div className='flex flex-row justify-between gap-4 bg-white py-2 align-baseline text-cs-text-dark'>
            <div className='basis-4/12 font-mono'>{infoKey}</div>
            <div className='flex flex-row text-right'>{value}</div>
        </div>
    )
}

interface IProjectInfoProps {
    language?: string
    stageName?: string
}
