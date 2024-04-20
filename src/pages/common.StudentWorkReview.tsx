import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { DisplayError, Loading, toast } from '~/components'
import { useCurrentUser, useGetComments, useStudentDocument } from '~/hooks'
import {
    ApproveDocumentButton,
    CommentInput,
    DocumentCommentsFeed,
    FilePreview,
    ProjectInfo,
    RejectDocumentButton,
} from '~/pages/components'
import { useTranslation } from 'react-i18next'
import { routes } from '~/pages/index.ts'

export function StudentWorkReview() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { id, role, allowedStageIds } = useCurrentUser()
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const documentId = searchParams.get('documentId')
    const { data: comments, isInitialLoading: isCommentsLoading } = useGetComments(documentId?.toString())
    const { data: doc, isInitialLoading: isDocumentLoading } = useStudentDocument(studentId, documentId)

    if (!studentId) return <DisplayError error={Error('Missing required search param: `studentId`')} />
    if (!documentId) return <DisplayError error={Error('Missing required search param: `documentId`')} />
    if (isDocumentLoading) return <Loading />
    if (!doc) return <DisplayError error={Error(`Couldn't get data on document ${documentId}`)} />

    const stageAllowed = role === 'student' || (allowedStageIds?.includes(doc.stageDTO.stageId) ?? false)

    if (!stageAllowed) {
        toast(t('feed.cantViewStage'))
        return <Navigate to={-1 as never} />
    }

    comments?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return (
        <div className='mx-auto grid h-3/4 w-5/6 grid-cols-[11fr_4fr] gap-8'>
            <div className='row-span-2 border-e border-cs-additional-gray pe-10'>
                <h2 className='mb-8 text-3xl font-bold'>{doc.originalName}</h2>
                <FilePreview studentId={studentId} documentId={documentId} />
            </div>
            <div className='row-span-2 flex flex-col justify-between'>
                <div>
                    <a onClick={() => navigate(routes.aStudentFeed(studentId))}>
                        <i className='ri-history-line' /> {t('feed.checkHistory')}
                    </a>
                    <h3 className='mb-4 mt-4 text-xl font-bold text-cs-text-dark'>{t('feed.review')}</h3>
                    <div className='max-h-[320px] overflow-y-auto px-4 pb-4'>
                        {isCommentsLoading ? <Loading /> : <DocumentCommentsFeed documentId={documentId} />}
                    </div>
                    <CommentInput
                        documentId={documentId}
                        userId={id.toString()}
                        options={{ useVerticalLayout: true, hideAvatar: true }}
                    />
                    <hr className='my-4 border-cs-additional-gray' />
                    {doc.approvedDate ? (
                        <h2
                            className={`mt-4 text-center text-2xl uppercase ${
                                doc.approved ? 'text-cs-primary' : 'text-cs-warning'
                            }`}
                        >
                            {t('workStatus') + ': ' + t(`workStatuses.${doc.approved ? 'accepted' : 'rejected'}`)}
                        </h2>
                    ) : (
                        <div className='flex flex-row justify-between'>
                            <ApproveDocumentButton studentId={studentId} document={doc} />
                            <RejectDocumentButton studentId={studentId} document={doc} />
                        </div>
                    )}
                </div>
                <div>
                    <hr className='mb-8 border-cs-additional-gray' />
                    <h3 className='mb-4 mt-4 text-xl font-bold text-cs-text-dark'>{t('feed.projectInfo')}</h3>
                    <ProjectInfo stageName={doc.stageDTO.name} />
                </div>
            </div>
        </div>
    )
}
