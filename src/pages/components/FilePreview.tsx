import { useTranslation } from 'react-i18next'
import endpoints from '~/backend/endpoints.ts'
import { DisplayError, Loading } from '~/components'
import { useStudentDocument } from '~/hooks'

export function FilePreview({ studentId, documentId }: { studentId: string; documentId: string }) {
    const { t } = useTranslation()
    const { data: doc, isInitialLoading, error } = useStudentDocument(studentId, documentId)

    if (isInitialLoading) return <Loading />
    if (error) return <DisplayError error={error} />

    if (!doc)
        return (
            <DisplayError
                error={Error(`No document found with id ${documentId} associated with student ${studentId}`)}
            />
        )

    const dotNameSplit = doc.originalName.split('.')
    let extension = t('unknownExtension')
    if (dotNameSplit.length > 1) extension = '.' + dotNameSplit[dotNameSplit.length - 1]
    const fileUrl = endpoints.files.getDocument(documentId)

    if (doc.originalName.endsWith('.pdf')) {
        return (
            <object className='mx-auto' data={fileUrl} type='application/pdf' width='100%' height='100%'>
                <p className='text-center text-2xl'>
                    {t('previewNotSupported')}. {t('youCanDownload...')} <a href={fileUrl}>{t('...here')}</a>.
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
                {t('youCanDownload...')} <a href={fileUrl}>{t('...here')}</a>.
            </p>
        </>
    )
}
