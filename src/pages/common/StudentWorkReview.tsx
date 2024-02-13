import { useSearchParams } from 'react-router-dom'
import { DisplayError, Loading } from '~/components'
import { useStudent, useStudentDocument } from '~/hooks'
import { FilePreview } from '~/pages/components'

export function StudentWorkReview() {
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const documentId = searchParams.get('documentId')
    const { data: student, isInitialLoading: isStudentLoading } = useStudent(studentId)
    const { data: doc, isInitialLoading: isDocumentLoading } = useStudentDocument(studentId, documentId)

    if (!studentId) return <DisplayError error={Error('Missing required search param: `studentId`')} />
    if (!documentId) return <DisplayError error={Error('Missing required search param: `documentId`')} />
    if (isStudentLoading) return <Loading />
    if (!student) return <DisplayError error={Error(`Couldn't get data on student ${studentId}`)} />
    if (!isDocumentLoading && !doc) return <DisplayError error={Error(`Couldn't get data on document ${documentId}`)} />

    return (
        <div className='mx-auto flex h-3/4 w-5/6 flex-col gap-8'>
            <FilePreview studentId={studentId} documentId={documentId} />
        </div>
    )
}
