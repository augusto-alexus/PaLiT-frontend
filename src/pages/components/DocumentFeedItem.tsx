import { useTranslation } from 'react-i18next'
import { IDocumentDTO, IStageDTO } from '~/backend'
import { Avatar, Feed, IconButton, IFeedElement, Loading } from '~/components'
import { useAllUsers, useCheckIfStageMoveAllowed, useCurrentUser, useDocumentReview, useGetComments } from '~/hooks'
import { routes } from '~/pages'
import { useFeedStore } from '~/store'
import { CommentInput } from '~/pages/components'

export function DocumentFeedItem({
    document,
    studentId,
    stages,
}: {
    document: IDocumentDTO
    studentId: string
    stages: IStageDTO[]
}) {
    const { showCommentsForDocumentId, setShowCommentsForDocumentId } = useFeedStore()
    const isStageMoveAllowed = useCheckIfStageMoveAllowed()

    const { documentId } = document
    const showComments = showCommentsForDocumentId === documentId

    const { id } = useCurrentUser()
    const { t } = useTranslation()
    const { mutate: reviewDocument } = useDocumentReview()
    const curStageOrder = document.stageDTO.serialOrder
    const nextStage = stages.find((s) => s.serialOrder === curStageOrder + 1)
    return (
        <div className={`${showComments ? 'sticky left-0 top-0 z-10' : ''} flex flex-col gap-8 py-1`}>
            <div className='flex flex-row place-items-start items-center gap-2'>
                <a
                    className='text-cs-text-neutral hover:text-cs-secondary'
                    href={routes.common.aWorkReview(studentId, document.documentId.toString())}
                >
                    <i className='ri-eye-line' />
                </a>
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
                {nextStage && isStageMoveAllowed(document.stageDTO.stageId, document.approvedDate) && (
                    <IconButton
                        onClick={() =>
                            reviewDocument({
                                documentId: documentId.toString(),
                                studentId,
                                verdict: 'approved',
                                nextStageId: nextStage.stageId,
                            })
                        }
                        title={t('feed.approveDocument')}
                    >
                        <i className='ri-check-line' />
                    </IconButton>
                )}
                {isStageMoveAllowed(document.stageDTO.stageId, document.approvedDate) && (
                    <IconButton
                        onClick={() =>
                            reviewDocument({
                                documentId: documentId.toString(),
                                studentId,
                                verdict: 'rejected',
                            })
                        }
                        title={t('feed.rejectDocument')}
                    >
                        <i className='ri-close-line' />
                    </IconButton>
                )}
            </div>
            {showComments && <DocumentCommentsFeed documentId={documentId.toString()} />}
            {showComments && (
                <div className='mb-8'>
                    <CommentInput documentId={documentId.toString()} userId={id.toString()} />
                </div>
            )}
        </div>
    )
}

export function DocumentCommentsFeed({ documentId }: { documentId: string }) {
    const { data: comments, isInitialLoading: isInitLoadingComments } = useGetComments(documentId)
    const { users, isInitialLoading: isInitLoadingUsers } = useAllUsers()
    if (isInitLoadingComments || isInitLoadingUsers) return <Loading />

    const feedElements = comments?.map((c) => {
        const user = users?.find((u) => u.userId.toString() === c.userId.toString())
        return {
            iconL: (
                <Avatar
                    firstName={user?.firstName ?? '?'}
                    lastName={user?.lastName ?? '?'}
                    bgColor={'bg-cs-primary'}
                    small
                />
            ),
            content: c.text,
            date: new Date(c.createdAt),
        } as IFeedElement
    })
    return <Feed data={feedElements} />
}
