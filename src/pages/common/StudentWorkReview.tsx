import { useSearchParams } from 'react-router-dom'
import { DisplayError, Loading } from '~/components'
import { useCurrentUser, useMyStudent, useStudent, useStudentDocument } from '~/hooks'
import { CommentInput, FilePreview, ProjectInfo } from '~/pages/components'
import { useTranslation } from 'react-i18next'
import { routes } from '~/pages'

export function StudentWorkReview() {
    const { t } = useTranslation()
    const { id } = useCurrentUser()
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const documentId = searchParams.get('documentId')
    const { data: student, isInitialLoading: isStudentLoading } = useStudent(studentId)
    const { data: doc, isInitialLoading: isDocumentLoading } = useStudentDocument(studentId, documentId)
    const { data: myStudent, isInitialLoading: isMyStudentLoading } = useMyStudent(studentId)

    if (!studentId) return <DisplayError error={Error('Missing required search param: `studentId`')} />
    if (!documentId) return <DisplayError error={Error('Missing required search param: `documentId`')} />
    if (isStudentLoading || isDocumentLoading || isMyStudentLoading) return <Loading />
    if (!student) return <DisplayError error={Error(`Couldn't get data on student ${studentId}`)} />
    if (!doc) return <DisplayError error={Error(`Couldn't get data on document ${documentId}`)} />

    return (
        <div className='mx-auto grid h-3/4 w-5/6 grid-cols-[11fr_4fr] gap-8'>
            <div className='row-span-2 border-e border-cs-additional-gray pe-10'>
                <h2 className='mb-8 text-3xl font-bold'>{doc.originalName}</h2>
                <FilePreview studentId={studentId} documentId={documentId} />
            </div>
            <div className='row-span-2 flex flex-col justify-between'>
                <div>
                    <a href={routes.common.aStudentFeed(studentId)}>
                        <i className='ri-history-line' /> {t('feed.checkHistory')}
                    </a>
                    <h3 className='mb-4 mt-4 text-xl font-bold text-cs-text-dark'>{t('feed.review')}</h3>
                    <CommentInput
                        documentId={documentId}
                        userId={id.toString()}
                        options={{ useVerticalLayout: true, hideAvatar: true }}
                    />
                </div>
                <div>
                    <hr className='mb-8 border-cs-additional-gray' />
                    <h3 className='mb-4 mt-4 text-xl font-bold text-cs-text-dark'>{t('feed.projectInfo')}</h3>
                    <ProjectInfo myStudent={myStudent} />
                </div>
            </div>
        </div>
    )
}
