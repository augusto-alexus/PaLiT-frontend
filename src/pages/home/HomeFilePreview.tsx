import { useNavigate, useParams } from 'react-router-dom'
import { routes } from '~/pages'

export function HomeFilePreview() {
    const navigate = useNavigate()
    const { documentId } = useParams()

    if (!documentId) {
        navigate('..')
        return <></>
    }

    return (
        <div className='relative'>
            <button
                onClick={() => navigate(routes.home.files)}
                className='ri-arrow-go-back-line absolute left-4 top-0 rounded-full p-2 text-cs-text-dark hover:bg-cs-bg-neutral hover:text-cs-primary'
            />
            <h2 className='mb-4 text-center text-3xl font-semibold text-cs-text-dark'>
                Перегляд документа
            </h2>
            <object
                className='resize'
                data={`http://localhost:8080/api/file/${documentId}`}
                type='application/pdf'
                width='100%'
                height='1000px'
            >
                <p>
                    It appears your web browser doesn't support embedding PDFs.
                    You can download the PDF{' '}
                    <a
                        href={`http://localhost:8080/api/file/${documentId}`}
                        download='test.pdf'
                    >
                        here
                    </a>
                    .
                </p>
            </object>
        </div>
    )
}
