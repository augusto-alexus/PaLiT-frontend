import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getComments, IDocumentDTO } from '~/backend'
import { Avatar, Feed, IconButton, IFeedElement, Loading } from '~/components'
import {
    useAccessToken,
    useCurrentUser,
    useDocumentNextStage,
    useDocumentReview,
    useTeamInfo,
} from '~/hooks'
import { routes } from '~/pages'
import { CommentInput } from '~/pages/page-components/CommentInput.tsx'
import { useFeedStore } from '~/store/feedStore.ts'

export function DocumentFeedItem({
    document,
    isLastDocument,
}: {
    document: IDocumentDTO
    isLastDocument: boolean
}) {
    const { showCommentsForDocumentId, setShowCommentsForDocumentId } =
        useFeedStore()
    const { documentId } = document
    const showComments = showCommentsForDocumentId === documentId

    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const wasReviewed = !!document.approved || !!document.approvedDate
    const canBeMovedToNextStage = document.approved && isLastDocument
    const { mutate: reviewDocument } = useDocumentReview()
    const { mutate: moveDocumentToNextStage } = useDocumentNextStage()
    return (
        <div
            className={`${
                showComments ? 'sticky left-0 top-0 z-10' : ''
            } flex flex-col gap-8 py-1`}
        >
            <div className='flex flex-row place-items-start gap-2'>
                <IconButton
                    onClick={() =>
                        navigate(routes.filePreview(document.documentId))
                    }
                    title={t('feed.viewDocument')}
                >
                    <i className='ri-eye-line' />
                </IconButton>
                <IconButton
                    isActive={showComments}
                    onClick={() => setShowCommentsForDocumentId(documentId)}
                    title={t('feed.commentDocument')}
                >
                    <i className='ri-chat-1-line' />
                </IconButton>
                <div className='place-self-center'>
                    {t('feed.studentUploadedFile')}: {document.originalName}
                </div>
                {role === 'teacher' && !wasReviewed && (
                    <IconButton
                        onClick={() =>
                            reviewDocument({ documentId, verdict: 'approved' })
                        }
                        title={t('feed.approveDocument')}
                    >
                        <i className='ri-check-line' />
                    </IconButton>
                )}
                {role === 'teacher' && !wasReviewed && (
                    <IconButton
                        onClick={() =>
                            reviewDocument({ documentId, verdict: 'rejected' })
                        }
                        title={t('feed.rejectDocument')}
                    >
                        <i className='ri-close-line' />
                    </IconButton>
                )}
                {role === 'teacher' && canBeMovedToNextStage && (
                    <IconButton
                        onClick={() =>
                            moveDocumentToNextStage({ documentId, stageId: 1 })
                        }
                        title={t('feed.moveToNextStage')}
                    >
                        <i className='ri-arrow-up-circle-line' />
                    </IconButton>
                )}
            </div>
            {showComments && <DocumentCommentsFeed documentId={documentId} />}
            {showComments && (
                <div className='mb-8'>
                    <CommentInput documentId={documentId} />
                </div>
            )}
        </div>
    )
}

function DocumentCommentsFeed({ documentId }: { documentId: number }) {
    const accessToken = useAccessToken()
    const {
        data: comments,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['documentComments', documentId],
        queryFn: () => getComments(accessToken, documentId),
    })
    const { isLoading: isLoadingTeamInfo, teacher, student } = useTeamInfo()
    if ((isLoading && isFetching) || isLoadingTeamInfo) return <Loading />
    const feedElements = comments?.map((c) => {
        return {
            iconL: (
                <Avatar
                    small
                    user={{
                        role: c.from,
                        firstName:
                            c.from === 'student'
                                ? student.firstName
                                : teacher.firstName,
                        lastName:
                            c.from === 'student'
                                ? student.lastName
                                : teacher.lastName,
                    }}
                />
            ),
            content: c.text,
            date: new Date(c.createdAt),
        } as IFeedElement
    })
    return <Feed data={feedElements} />
}
