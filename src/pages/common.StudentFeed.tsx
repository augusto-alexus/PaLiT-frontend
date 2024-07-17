import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { IDocumentDTO, IStageDTO } from '~/backend'
import {
    DisplayError,
    Feed,
    FeedIconApprove,
    FeedIconReject,
    FileUpload,
    IFeedElement,
    ITab,
    MainContentLoading,
    Tabs,
} from '~/components'
import { useAllStages, useAllStudentDocuments, useCurrentUser, useMyProject, useMyStudents } from '~/hooks'
import { DocumentFeedItem } from '~/pages/components'
import { useFeedStore } from '~/store'

export function StudentFeed() {
    function reviewFeedItem(document: IDocumentDTO, movedToNextStage: boolean): IFeedElement {
        return {
            date: new Date(document.approvedDate),
            iconL: document.approved ? <FeedIconApprove /> : <FeedIconReject />,
            content: (
                <div>
                    {document.approved ? t('feed.documentApproved') : t('feed.documentRejected')}
                    {movedToNextStage && (
                        <>
                            <br />
                            <span className='font-semibold text-cs-primary'>{t('feed.nextStage')}</span>
                        </>
                    )}
                </div>
            ),
        }
    }

    function getDocumentFeedItem(document: IDocumentDTO, studentId: string, stages: IStageDTO[]): IFeedElement {
        return {
            date: new Date(document.createdDate),
            iconL: <i className='ri-file-line' />,
            content: <DocumentFeedItem document={document} studentId={studentId} stages={stages} />,
        }
    }

    const { t } = useTranslation()
    const currentUser = useCurrentUser()
    const role = currentUser.role
    const [searchParams] = useSearchParams()
    const paramsStudentId = searchParams.get('studentId')
    const studentId = currentUser.studentId?.toString() || paramsStudentId
    const { selectedStage: storedSelectedStage, setSelectedStage } = useFeedStore()
    const { myProject } = useMyProject()
    const { data: myStudents, isInitialLoading: myStudentsLoading } = useMyStudents()
    const { isInitialLoading: isLoadingStages, error: errorStage, data: stages } = useAllStages()
    const {
        isInitialLoading: isLoadingDocuments,
        error: errorDocuments,
        data: documents,
    } = useAllStudentDocuments(studentId)

    if (!studentId) return <DisplayError error={Error('studentId required to view feed')} />
    if (isLoadingDocuments || isLoadingStages || myStudentsLoading) return <MainContentLoading />
    if (errorDocuments) return <DisplayError error={errorDocuments} />
    if (errorStage) return <DisplayError error={errorStage} />
    if (!stages || !stages?.length) return <DisplayError error={new Error('No stages returned from the server')} />

    const selectedStage = storedSelectedStage ?? stages[0].serialOrder

    const stageTabs = stages.map<ITab>((s) => ({
        id: s.serialOrder,
        label: t(`stages.${s.name}`),
        isActive: s.serialOrder === selectedStage,
    }))

    const feedElements: IFeedElement[] = []
    const stageDocuments = documents?.filter((d) => d.stageDTO?.serialOrder === selectedStage)
    stageDocuments
        ?.filter((d) => d?.stageDTO?.serialOrder === selectedStage)
        ?.forEach((d) => {
            feedElements.push(getDocumentFeedItem(d, studentId, stages))
            if (d.approvedDate) {
                feedElements.push(reviewFeedItem(d, d.approved))
            }
        })

    const sortedFeedElements = feedElements.sort((a, b) => a.date.getTime() - b.date.getTime())

    const canViewStage =
        currentUser.allowedStageIds?.some((s) => s === selectedStage) ||
        (role !== 'teacher' &&
            selectedStage === 1 &&
            myStudents?.some((s) => s.student.studentId.toString() === studentId))

    const lastDocument = documents?.sort((a, b) => {
        const stageDelta = a.stageDTO.serialOrder - b.stageDTO.serialOrder
        if (stageDelta === 0) return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        return -stageDelta
    })?.[0]

    const canUpload =
        role === 'student' &&
        myProject?.stage?.stageId === selectedStage &&
        (!!lastDocument?.approved !== !!lastDocument?.approvedDate || !lastDocument)

    return (
        <div className='my-4 mr-12 flex flex-col gap-4'>
            <Tabs items={stageTabs} setItem={(id) => setSelectedStage(id)} />
            {role !== 'student' && !canViewStage ? (
                <div className='mt-8 text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('feed.cantViewStage')}
                </div>
            ) : !feedElements.length ? (
                <div className='mt-8 text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('feed.workHasntStartedYet')}
                </div>
            ) : (
                <div className='scrollbar mt-8 max-h-[600px] overflow-y-auto py-2'>
                    <div className='mx-auto w-[95%] overflow-x-visible'>
                        <Feed data={sortedFeedElements} />
                    </div>
                </div>
            )}
            {canUpload && (
                <div className='mt-16'>
                    <FileUpload />
                </div>
            )}
        </div>
    )
}
