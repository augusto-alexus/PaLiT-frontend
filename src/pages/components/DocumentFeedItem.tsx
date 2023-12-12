import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getComments, IDocumentDTO, IStageDTO } from '~/backend'
import {
    Avatar,
    Button,
    DisplayError,
    Feed,
    IconButton,
    IFeedElement,
    Loading,
    TextArea,
} from '~/components'
import {
    useAccessToken,
    useCurrentUser,
    useDocumentNextStage,
    useDocumentReview,
    useMakeComment,
    useTeamInfo,
} from '~/hooks'
import { routes } from '~/pages'
import { useFeedStore } from '~/store'

export function DocumentFeedItem({
    document,
    stages,
    isLastDocument,
}: {
    document: IDocumentDTO
    stages: IStageDTO[]
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
    const curStageOrder = (document?.stageDTO?.serialOrder as number) ?? 0
    const nextStage = stages.find((s) => s.serialOrder === curStageOrder + 1)
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
                {role === 'teacher' && canBeMovedToNextStage && nextStage && (
                    <IconButton
                        onClick={() => {
                            if (nextStage)
                                moveDocumentToNextStage({
                                    documentId,
                                    stageId: nextStage.stageId,
                                })
                        }}
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

function CommentInput({ documentId }: { documentId: number }) {
    const { t } = useTranslation()
    const [comment, setComment] = useState<string>('')
    const { mutate: makeComment } = useMakeComment()
    const { isLoading, teacher, student } = useTeamInfo()
    if (isLoading) return <Loading />
    const studentId = student.studentId
    const teacherId = teacher.teacherId
    if (!studentId || !teacherId)
        return (
            <DisplayError
                error={new Error('studentId or teacherId is undefined')}
            />
        )

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                makeComment({ documentId, studentId, teacherId, comment })
                setComment('')
            }}
            className='flex flex-row place-items-start gap-4'
        >
            <Avatar />
            <TextArea
                required
                name='comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('yourComment') + '...'}
            />
            <Button preset='filled' type='submit'>
                {t('send')}
            </Button>
        </form>
    )
}
