import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getAllStages, IMyStudent } from '~/backend'
import {
    getStudentDocuments,
    IDocumentDTO,
    reviewDocument,
} from '~/backend/file.ts'
import {
    Button,
    DisplayError,
    Feed,
    FileUpload,
    IFeedElement,
    Loading,
    toast,
} from '~/components'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { Role } from '~/models'
import { routes } from '~/pages/routes.ts'

export function StudentFeed() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const navigate = useNavigate()
    const { role, id, studentId } = useCurrentUser()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()
    const queryClient = useQueryClient()
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

    const { mutate: mutateReviewDocument } = useMutation({
        mutationFn: async ({
            documentId,
            verdict,
        }: {
            documentId: number
            verdict: 'approved' | 'rejected'
        }) => reviewDocument(accessToken, documentId, verdict),
        onSuccess: async ({ approved }) => {
            await queryClient.invalidateQueries([
                'studentDocuments',
                outletContext?.myStudent?.student.studentId || id,
            ])
            if (approved === 'true') toast(t('feed.documentApproved'))
            else toast(t('feed.documentRejected'))
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })

    // const { mutate: mutateMoveDocumentToNextStage } = useMutation({
    //     mutationFn: async ({
    //         documentId,
    //         stageId,
    //     }: {
    //         documentId: number
    //         stageId: number
    //     }) => moveDocumentToStage(accessToken, documentId, stageId),
    //     onSuccess: (data) => {
    //         console.log(data)
    //         toast(t('feed.documentMovedToNextStage'))
    //     },
    //     onError: (error: AxiosError | never) => {
    //         if (error instanceof AxiosError) {
    //             toast(`${t('error.unknownError')}! ${error.message}`)
    //         } else {
    //             toast(`${t('error.unknownError')}!`)
    //         }
    //     },
    // })

    if (isLoadingDocuments || isLoadingStages) return <Loading />
    if (errorDocuments) return <DisplayError error={errorDocuments} />
    if (errorStage) return <DisplayError error={errorStage} />

    const feedElements: IFeedElement[] = []
    const onPreview = (documentId: number) =>
        navigate(routes.filePreview(documentId))
    const onApprove = (documentId: number) =>
        mutateReviewDocument({ documentId, verdict: 'approved' })
    const onReject = (documentId: number) =>
        mutateReviewDocument({ documentId, verdict: 'rejected' })
    documents?.forEach((d, idx) => {
        feedElements.push(
            documentFeedItem(
                d,
                idx + 1 === documents.length,
                role,
                onPreview,
                onApprove,
                onReject,
                t
            )
        )
        if (d.approvedDate) feedElements.push(reviewFeedItem(d, t))
    })
    const sortedFeedElements = feedElements.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )

    return (
        <div className='mx-auto my-4 max-h-96 w-10/12'>
            {!feedElements.length ? (
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('feed.workHasntStartedYet')}
                </div>
            ) : (
                <Feed data={sortedFeedElements} />
            )}
            {role === 'student' && (
                <div className='mt-16'>
                    <FileUpload />
                </div>
            )}
        </div>
    )
}

function documentFeedItem(
    document: IDocumentDTO,
    isLastDocument: boolean,
    role: Role,
    onPreview: (documentId: number) => void,
    onApprove: (documentId: number) => void,
    onReject: (documentId: number) => void,
    t: TFunction<never, never>
): IFeedElement {
    const wasReviewed = !!document.approved || !!document.approvedDate
    const canBeMovedToNextStage = document.approved && isLastDocument
    return {
        date: new Date(document.createdDate),
        iconL: <i className='ri-file-line' />,
        content: (
            <div className='flex flex-row gap-2'>
                {role === 'teacher' && !wasReviewed && (
                    <Button
                        onClick={() => onApprove(document.documentId)}
                        preset='icon'
                        title={t('feed.approveDocument')}
                        icon={<i className='ri-check-line' />}
                    />
                )}
                {role === 'teacher' && !wasReviewed && (
                    <Button
                        onClick={() => onReject(document.documentId)}
                        preset='icon'
                        title={t('feed.rejectDocument')}
                        icon={<i className='ri-close-line' />}
                    />
                )}
                {role === 'teacher' && canBeMovedToNextStage && (
                    <Button
                        onClick={() => onReject(document.documentId)}
                        preset='icon'
                        title={t('feed.moveToNextStage')}
                        icon={<i className='ri-arrow-up-circle-line' />}
                    />
                )}
                <Button
                    onClick={() => onPreview(document.documentId)}
                    preset='icon'
                    title={t('feed.viewDocument')}
                    icon={<i className='ri-eye-line' />}
                />
                <div>{document.originalName}</div>
            </div>
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
