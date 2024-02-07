import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import endpoints from '~/backend/endpoints.ts'
import { DisplayError, Loading } from '~/components'
import { routes } from '~/pages/routes.ts'
import { useStudentDocument } from '~/hooks'

export function FilePreview() {
    const { t } = useTranslation()
    const { studentId, documentId } = useParams()
    const { data: doc, isLoading, isFetching, error } = useStudentDocument(studentId, documentId)

    if (!studentId || !documentId) return <Navigate to={routes.authRedirect} />
    if (isLoading && isFetching) return <Loading />
    if (error) return <DisplayError error={error} />

    if (!doc) {
        return (
            <DisplayError
                error={Error(`No document found with id ${documentId} associated with student ${studentId}`)}
            />
        )
    }

    const dotNameSplit = doc.originalName.split('.')
    let extension = t('unknownExtension')
    if (dotNameSplit.length > 1) extension = '.' + dotNameSplit[dotNameSplit.length - 1]

    if (doc.originalName.endsWith('.pdf')) {
        return (
            <object
                className='mx-auto'
                data={endpoints.files.getDocument(documentId)}
                type='application/pdf'
                width='100%'
                height='100%'
            >
                <p className='text-center text-2xl'>
                    {t('previewNotSupported')}. {t('youCanDownload...')}{' '}
                    <a href={endpoints.files.getDocument(documentId)}>{t('...here')}</a>.
                </p>
            </object>
        )
    }

    return (
        <>
            <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                {t('previewImpossibleWithExtension', { extension })}.
            </div>
            <p className='mt-4 text-center text-xl text-cs-text-dark'>
                {t('youCanDownload...')} <a href={endpoints.files.getDocument(documentId)}>{t('...here')}</a>.
            </p>
        </>
    )
}
