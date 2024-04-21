import { PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IMyStudent } from '~/models'
import { useCurrentUser, useGetTheme, useMyProject, useStudent, useThemeUpdate } from '~/hooks'
import { Button, Input, Loading } from '~/components'
import { useSearchParams } from 'react-router-dom'

export function SidebarContainer({ children, myStudent }: PropsWithChildren<{ myStudent?: IMyStudent }>) {
    return (
        <div className='flex w-full flex-row justify-between'>
            <div className='w-full'>{children}</div>
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

function ThemeUpdateForm({ studentId }: { studentId: string }) {
    const { t } = useTranslation()
    const { data: currentTheme } = useGetTheme(studentId)
    const { mutate: updateTheme } = useThemeUpdate(() => setUpdateMode(false))
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const [newTheme, setNewTheme] = useState<string>('')
    useEffect(() => {
        setNewTheme(currentTheme?.theme ?? '')
    }, [currentTheme, updateMode])
    if (updateMode)
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    updateTheme({ studentId, newTheme })
                }}
            >
                <hr className='my-4 border-t border-cs-additional-gray' />
                <p className='mb-4'>{t('theme')}</p>
                <Input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} />
                <div className='mt-4 flex flex-row justify-end gap-4'>
                    <Button type='submit'>{t('submit')}</Button>
                    <Button className='bg-cs-additional-gray' onClick={() => setUpdateMode(false)}>
                        {t('cancel')}
                    </Button>
                </div>
            </form>
        )
    return (
        <div className='flex flex-col gap-4'>
            <InfoRow infoKey={t('projectInfo.theme')} value={currentTheme?.theme} />
            <Button onClick={() => setUpdateMode(true)}>{t('changeTheme')}</Button>
        </div>
    )
}

interface IProjectInfoProps {
    language?: string
    stageName?: string
}
