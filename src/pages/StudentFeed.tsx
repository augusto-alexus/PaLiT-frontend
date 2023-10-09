import { useQuery } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import {
    getAllStages,
    getStudentDocuments,
    IDocumentDTO,
    IMyStudent,
} from '~/backend'
import {
    DisplayError,
    Feed,
    FileUpload,
    IFeedElement,
    Loading,
} from '~/components'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { DocumentFeedItem } from '~/pages/page-components'

export function StudentFeed() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const { role, id, studentId } = useCurrentUser()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()

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
        // data: stages,
    } = useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(accessToken),
    })

    if (isLoadingDocuments || isLoadingStages) return <Loading />
    if (errorDocuments) return <DisplayError error={errorDocuments} />
    if (errorStage) return <DisplayError error={errorStage} />

    const feedElements: IFeedElement[] = []
    documents?.forEach((d, idx) => {
        feedElements.push(getDocumentFeedItem(d, idx + 1 === documents.length))
        if (d.approvedDate) feedElements.push(reviewFeedItem(d, t))
    })
    const sortedFeedElements = feedElements.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )

    return (
        <div className='mx-auto my-4 flex w-10/12 flex-col gap-4'>
            {!feedElements.length ? (
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
            {role === 'student' && (
                <div className='mt-16'>
                    <FileUpload />
                </div>
            )}
        </div>
    )
}

function getDocumentFeedItem(
    document: IDocumentDTO,
    isLastDocument: boolean
): IFeedElement {
    return {
        date: new Date(document.createdDate),
        iconL: <i className='ri-file-line' />,
        content: (
            <DocumentFeedItem
                document={document}
                isLastDocument={isLastDocument}
            />
        ),
    }
}

function reviewFeedItem(
    document: IDocumentDTO,
    t: TFunction<never, never>
): IFeedElement {
    return {
        date: new Date(document.approvedDate),
        content: (
            <div>
                {document.approved
                    ? t('feed.documentApproved')
                    : t('feed.documentRejected')}
            </div>
        ),
    }
}