import { Transition } from '@headlessui/react'
import { Fragment, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IMyProject } from '~/backend'
import { useAllStages, useMyProject } from '~/hooks'
import { IMyStudent } from '~/models'

export function SidebarContainer(
    props: PropsWithChildren<{ myStudent?: IMyStudent }>
) {
    const [infoCollapsed, setInfoCollapsed] = useState<boolean>(false)
    const [showExtendButton, setShowExtendButton] = useState<boolean>(false)
    return (
        <div className='mx-24 flex flex-row justify-between'>
            <main className='w-10/12'>{props.children}</main>
            <div>
                {showExtendButton && (
                    <button
                        onClick={() => setInfoCollapsed(false)}
                        className='h-8 w-8 rounded-full border-0 bg-transparent p-0 text-cs-additional-gray hover:border-0 hover:bg-[#C3C3C366]'
                    >
                        <i className='ri-arrow-left-s-line text-2xl'></i>
                    </button>
                )}
                <Transition.Root
                    show={!infoCollapsed}
                    as={Fragment}
                    afterLeave={() => setShowExtendButton(true)}
                    beforeEnter={() => setShowExtendButton(false)}
                >
                    <Transition.Child as={Fragment}>
                        <div className='w-fit max-w-md overflow-hidden'>
                            <button
                                onClick={() => setInfoCollapsed(true)}
                                className='h-8 w-8 rounded-full border-0 bg-transparent p-0 text-cs-additional-gray hover:border-0 hover:bg-[#C3C3C366]'
                            >
                                <i className='ri-arrow-right-s-line text-2xl'></i>
                            </button>
                            <ProjectInfo myStudent={props.myStudent} />
                        </div>
                    </Transition.Child>
                </Transition.Root>
            </div>
        </div>
    )
}

export function ProjectInfo({ myStudent }: { myStudent?: IMyStudent }) {
    const { myProject } = useMyProject()
    if (myStudent) return <TeacherProjectInfo myStudent={myStudent} />
    if (myProject) return <StudentProjectInfo myProject={myProject} />
    return <></>
}

function TeacherProjectInfo({ myStudent }: { myStudent: IMyStudent }) {
    const { t } = useTranslation()
    const { data: stages } = useAllStages()
    const { student, stage } = myStudent
    const currentStage = stage ?? stages?.[0]
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
                value={currentStage?.['name'] ?? undefined}
            />
        </div>
    )
}

function StudentProjectInfo({ myProject }: { myProject: IMyProject }) {
    const { t } = useTranslation()
    const { data: stages } = useAllStages()
    const { advisor, stage } = myProject
    const currentStage = stage ?? stages?.[0]
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
                value={currentStage?.['name'] ?? undefined}
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
