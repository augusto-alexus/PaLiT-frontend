import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { IMyStudent } from '~/backend'
import endpoints from '~/backend/endpoints.ts'
import { getStudentDocuments } from '~/backend/file.ts'
import { Button, DisplayError, Loading } from '~/components'
import { useCurrentUser } from '~/hooks'

export function FilePreview() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { documentId } = useParams()
    const { role, id, studentId } = useCurrentUser()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()

    const { isLoading, isFetching, error, data } = useQuery({
        enabled: role === 'student' || !!outletContext?.myStudent,
        queryKey: [
            'studentDocuments',
            outletContext?.myStudent?.student.studentId || id,
        ],
        queryFn: async () => {
            const myStudentId = outletContext?.myStudent?.student.studentId
            const myId = studentId
            if (myStudentId) return getStudentDocuments(myStudentId)
            else if (myId) return getStudentDocuments(myId)
            throw new Error("Can't load document list: no authorized user.")
        },
    })

    if (isLoading && isFetching) return <Loading />
    if (error) return <DisplayError error={error} />

    const docToPreview = data?.find((d) => d.documentId === Number(documentId))

    if (!documentId || !docToPreview) {
        navigate('..')
        return <></>
    }

    const dotNameSplit = docToPreview.originalName.split('.')
    let extension = t('unknownExtension')
    if (dotNameSplit.length > 1)
        extension = '.' + dotNameSplit[dotNameSplit.length - 1]

    return (
        <div className='-mt-10'>
            <h2 className='mb-4 text-center text-3xl font-semibold text-cs-text-dark'>
                <Button
                    preset='icon'
                    onClick={() => navigate(`..`)}
                    className='ri-arrow-go-back-line mr-2 inline -translate-y-1 rounded-full p-2 text-lg text-cs-text-dark hover:bg-cs-bg-neutral hover:text-cs-primary'
                />
                {t('documentPreview')}
            </h2>
            {docToPreview.originalName.endsWith('.pdf') ? (
                <object
                    className='mx-auto'
                    data={`http://localhost:8080/api/file/${documentId}`}
                    type='application/pdf'
                    width='80%'
                    height='800px'
                >
                    <p className='text-center text-2xl'>
                        {t('previewNotSupported')}. {t('youCanDownload...')}{' '}
                        <a
                            href={endpoints.files.getDocument(
                                Number(documentId)
                            )}
                        >
                            {t('...here')}
                        </a>
                        .
                    </p>
                </object>
            ) : (
                <>
                    <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                        {t('previewImpossibleWithExtension', { extension })}.
                    </div>
                    <p className='mt-4 text-center text-xl text-cs-text-dark'>
                        {t('youCanDownload...')}{' '}
                        <a
                            href={endpoints.files.getDocument(
                                Number(documentId)
                            )}
                        >
                            {t('...here')}
                        </a>
                        .
                    </p>
                </>
            )}
        </div>
    )
}
