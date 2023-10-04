import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '~/components'

export function FilePreview() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { documentId } = useParams()

    if (!documentId) {
        navigate('..')
        return <></>
    }

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
            <object
                className='mx-auto'
                data={`http://localhost:8080/api/file/${documentId}`}
                type='application/pdf'
                width='80%'
                height='800px'
            >
                <p>
                    {t('previewNotSupported')}. {t('youCanDownload...')}{' '}
                    <a
                        href={`http://localhost:8080/api/file/${documentId}`}
                        download='test.pdf'
                    >
                        {t('...here')}
                    </a>
                    .
                </p>
            </object>
        </div>
    )
}
