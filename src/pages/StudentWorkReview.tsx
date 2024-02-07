import { Navigate, useParams } from 'react-router-dom'
import { routes } from '~/pages/routes.ts'
import { FilePreview } from '~/pages/FilePreview.tsx'
import { Breadcrumbs, DisplayError } from '~/components'
import { useStudent, useStudentDocument } from '~/hooks'

export function StudentWorkReview() {
    const { studentId, documentId } = useParams()
    if (!studentId || !documentId) return <Navigate to={routes.authRedirect} />
    const { data: student, isLoading: isStudentLoading } = useStudent(studentId)
    const { data: doc, isLoading: isDocumentLoading } = useStudentDocument(studentId, documentId)

    if (!isStudentLoading && !student)
        return <DisplayError error={Error(`Couldn't get data on student ${studentId}`)} />

    if (!isDocumentLoading && !doc) return <DisplayError error={Error(`Couldn't get data on document ${documentId}`)} />

    const studentBreadcrumbComponent = isStudentLoading ? (
        <div className='animate-pulse'>
            <div className='h-4 w-32 rounded-3xl bg-cs-additional-gray'></div>
        </div>
    ) : (
        `${student?.lastName}, ${student?.firstName}`
    )

    const documentBreadcrumbComponent = isDocumentLoading ? (
        <div className='animate-pulse'>
            <div className='h-4 w-32 rounded-3xl bg-cs-additional-gray'></div>
        </div>
    ) : (
        `${doc?.originalName} (${new Date(doc!.createdDate).toLocaleString()})`
    )

    return (
        <div className='mx-auto flex h-3/4 w-5/6 flex-col gap-8'>
            <Breadcrumbs
                items={[
                    { component: <i className='ri-home-2-fill' />, linkedTo: routes.authRedirect },
                    { component: studentBreadcrumbComponent, linkedTo: 'whatever' },
                    { component: documentBreadcrumbComponent, linkedTo: '#' },
                ]}
            />
            <FilePreview />
        </div>
    )
}
