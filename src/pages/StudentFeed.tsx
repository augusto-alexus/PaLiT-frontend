import { useQuery } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { getStudentDocuments, IDocumentDTO, IStageDTO } from '~/backend'
import {
    DisplayError,
    Feed,
    FeedIconApprove,
    FeedIconReject,
    FileUpload,
    IFeedElement,
    ITab,
    Loading,
    Tabs,
} from '~/components'
import { useAllStages, useCurrentUser, useMyProject } from '~/hooks'
import { IMyStudent } from '~/models'
import { DocumentFeedItem } from '~/pages/components'
import { useFeedStore } from '~/store'

export function StudentFeed() {
    const { t } = useTranslation()
    const { role, id, studentId, allowedStageIds } = useCurrentUser()
    const { selectedStage: storedSelectedStage, setSelectedStage } =
        useFeedStore()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()

    const { myProject } = useMyProject()

    const {
        isLoading: isLoadingDocuments,
        error: errorDocuments,
        data: documents,
    } = useQuery({
        enabled: role === 'student' || !!outletContext?.myStudent,
        queryKey: [
            'studentDocuments',
            outletContext?.myStudent?.student.studentId || id,
        ],
        queryFn: async () => {
            const myStudentId = outletContext?.myStudent?.student.studentId
            const myId = studentId
            if (myStudentId) return getStudentDocuments(myStudentId)
            else if (myId) return getStudentDocuments(myId)
            throw new Error("Can't load document list: no authorized user.")
        },
    })

    const {
        isLoading: isLoadingStages,
        error: errorStage,
        data: stages,
    } = useAllStages()

    if (isLoadingDocuments || isLoadingStages) return <Loading />
    if (errorDocuments) return <DisplayError error={errorDocuments} />
    if (errorStage) return <DisplayError error={errorStage} />
    if (!stages)
        return (
            <DisplayError
                error={new Error('No stages returned from the server')}
            />
        )

    const selectedStage = storedSelectedStage ?? stages[0].serialOrder

    const stageTabs = stages.map<ITab>((s) => ({
        id: s.serialOrder,
        label: s.name,
        isActive: s.serialOrder === selectedStage,
    }))

    const feedElements: IFeedElement[] = []
    const stageDocuments = documents?.filter(
        (d) => d.stageDTO?.serialOrder === selectedStage
    )
    const firstDocNextStage = documents?.find(
        (d) => (d?.stageDTO?.serialOrder ?? -Infinity) > selectedStage
    )
    if (firstDocNextStage) stageDocuments?.push(firstDocNextStage)
    stageDocuments?.forEach((d, idx, arr) => {
        feedElements.push(
            getDocumentFeedItem(
                d,
                selectedStage,
                stages,
                d.approved &&
                    idx + 1 === arr.length &&
                    d.stageDTO?.stageId === selectedStage
            )
        )
        if (d.approvedDate) {
            const movedToNextStage = d.stageDTO?.stageId !== selectedStage
            feedElements.push(reviewFeedItem(d, t, movedToNextStage))
        }
    })
    const sortedFeedElements = feedElements.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )

    const projectApproved: boolean =
        (role === 'teacher' && !!outletContext?.myStudent) || role === 'student'

    const teacherCanViewStage = allowedStageIds?.some(
        (s) => s === selectedStage
    )

    return (
        <div className='mx-auto my-4 flex w-10/12 flex-col gap-4'>
            <Tabs items={stageTabs} setItem={(id) => setSelectedStage(id)} />
            {role === 'teacher' && !teacherCanViewStage ? (
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('feed.cantViewStage')}
                </div>
            ) : !feedElements.length ? (
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('feed.workHasntStartedYet')}
                </div>
            ) : (
                <div className='scrollbar max-h-[600px] overflow-y-auto py-2'>
                    <div className='mx-auto w-[95%] overflow-x-visible'>
                        <Feed data={sortedFeedElements} />
                    </div>
                </div>
            )}
            {!projectApproved && (
                <div className='text-md col-span-5 mt-2 text-center text-cs-warning'>
                    {t('hodRequestNotApproved')}
                </div>
            )}
            {role === 'student' &&
                projectApproved &&
                myProject?.stage?.stageId === selectedStage && (
                    <div className='mt-16'>
                        <FileUpload />
                    </div>
                )}
        </div>
    )
}

function getDocumentFeedItem(
    document: IDocumentDTO,
    selectedStage: number,
    stages: IStageDTO[],
    canBeMovedToNextStage: boolean
): IFeedElement {
    return {
        date: new Date(document.createdDate),
        iconL: <i className='ri-file-line' />,
        content: (
            <DocumentFeedItem
                document={document}
                selectedStage={selectedStage}
                stages={stages}
                canBeMovedToNextStage={canBeMovedToNextStage}
            />
        ),
    }
}

function reviewFeedItem(
    document: IDocumentDTO,
    t: TFunction<never, never>,
    movedToNextStage: boolean
): IFeedElement {
    return {
        date: new Date(document.approvedDate),
        iconL: document.approved ? <FeedIconApprove /> : <FeedIconReject />,
        content: (
            <div>
                {document.approved
                    ? t('feed.documentApproved')
                    : t('feed.documentRejected')}
                {movedToNextStage && (
                    <>
                        <br />
                        <span className='font-semibold text-cs-primary'>
                            {t('feed.nextStage')}
                        </span>
                    </>
                )}
            </div>
        ),
    }
}
