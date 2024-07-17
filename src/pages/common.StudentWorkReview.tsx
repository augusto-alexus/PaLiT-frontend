import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Accordion, Button, DisplayError, Loading, MainContentLoading, toast } from '~/components'
import {
    useAllStages,
    useCheckIfStageMoveAllowed,
    useCurrentUser,
    useDocumentReview,
    useGetComments,
    useMyStudents,
    useStudentDocument,
} from '~/hooks'
import { CommentInput, DocumentCommentsFeed, FilePreview, ProjectInfo } from '~/pages/components'
import { useTranslation } from 'react-i18next'
import { routes } from '~/pages/index.ts'
import { IDocumentDTO } from '~/backend'

export function StudentWorkReview() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { id, role, allowedStageIds } = useCurrentUser()
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const documentId = searchParams.get('documentId')
    const { data: comments, isInitialLoading: isCommentsLoading } = useGetComments(documentId?.toString())
    const { data: doc, isInitialLoading: isDocumentLoading } = useStudentDocument(studentId, documentId)
    const { data: myStudents, isInitialLoading: myStudentsLoading } = useMyStudents()

    if (!studentId) return <DisplayError error={Error('Missing required search param: `studentId`')} />
    if (!documentId) return <DisplayError error={Error('Missing required search param: `documentId`')} />
    if (isDocumentLoading || myStudentsLoading) return <MainContentLoading />
    if (!doc) return <DisplayError error={Error(`Couldn't get data on document ${documentId}`)} />

    const stageAllowed =
        role === 'student' ||
        (allowedStageIds?.includes(doc.stageDTO.stageId) ?? false) ||
        (doc.stageDTO.serialOrder === 1 && myStudents?.some((st) => st.student.studentId.toString() === studentId))

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
            <div className='row-span-2 flex flex-col'>
                <a className='cursor-pointer' onClick={() => navigate(routes.aStudentFeed(studentId))}>
                    <i className='ri-history-line' /> {t('feed.checkHistory')}
                </a>
                <Accordion
                    header={<h3 className='text-xl font-bold text-cs-text-dark'>{t('feed.comments')}</h3>}
                    body={
                        <>
                            <div className='max-h-[320px] overflow-y-auto px-4 pb-4'>
                                {isCommentsLoading ? <Loading /> : <DocumentCommentsFeed documentId={documentId} />}
                            </div>
                            <CommentInput
                                documentId={documentId}
                                userId={id.toString()}
                                options={{ useVerticalLayout: true, hideAvatar: true }}
                            />
                        </>
                    }
                    cls='mb-4 mt-4'
                />
                <Accordion
                    header={<h3 className='text-xl font-bold text-cs-text-dark'>{t('feed.projectInfo')}</h3>}
                    body={<ProjectInfo stageName={doc.stageDTO.name} />}
                    cls='mt-4 mb-8'
                />
                <hr className='mb-4 border-cs-additional-gray' />
                {doc.approvedDate ? (
                    <h2
                        className={`mt-4 text-center text-2xl uppercase ${
                            doc.approved ? 'text-cs-primary' : 'text-cs-warning'
                        }`}
                    >
                        {t('workStatus') + ': ' + t(`workStatuses.${doc.approved ? 'accepted' : 'rejected'}`)}
                    </h2>
                ) : role === 'student' ? (
                    <h2 className='mt-4 text-center text-2xl uppercase text-cs-text-dark'>
                        {t('workStatuses.toReview')}
                    </h2>
                ) : (
                    <div className='flex flex-row justify-between space-x-4'>
                        <ApproveDocumentButton studentId={studentId} document={doc} />
                        <RejectDocumentButton studentId={studentId} document={doc} />
                    </div>
                )}
            </div>
        </div>
    )
}

function ApproveDocumentButton({ studentId, document }: { studentId: string; document: IDocumentDTO }) {
    const { t } = useTranslation()
    const { data: stages, isInitialLoading } = useAllStages()
    const { mutate: reviewDocument } = useDocumentReview()
    const isStageMoveAllowed = useCheckIfStageMoveAllowed()

    if (isInitialLoading) return <Loading />

    const nextStage = stages?.find((s) => s.serialOrder - 1 === document.stageDTO.serialOrder)

    if (!isStageMoveAllowed(studentId, document.stageDTO.stageId, document.stageDTO.serialOrder, document.approvedDate))
        return <></>

    return (
        <Button
            className='w-full bg-cs-accent-green hover:bg-cs-secondary'
            title={t('feed.approveDocument')}
            onClick={() =>
                reviewDocument({
                    documentId: document.documentId.toString(),
                    studentId,
                    verdict: 'approved',
                    nextStageId: nextStage?.stageId,
                })
            }
        >
            {t('feed.approveDocument')}
        </Button>
    )
}

function RejectDocumentButton({ studentId, document }: { studentId: string; document: IDocumentDTO }) {
    const { t } = useTranslation()
    const { mutate: reviewDocument } = useDocumentReview()
    const isStageMoveAllowed = useCheckIfStageMoveAllowed()

    if (!isStageMoveAllowed(studentId, document.stageDTO.stageId, document.stageDTO.serialOrder, document.approvedDate))
        return <></>

    return (
        <Button
            className='w-full bg-cs-warning hover:bg-cs-secondary'
            title={t('feed.rejectDocument')}
            onClick={() =>
                reviewDocument({
                    documentId: document.documentId.toString(),
                    studentId,
                    verdict: 'rejected',
                })
            }
        >
            {t('feed.rejectDocument')}
        </Button>
    )
}
