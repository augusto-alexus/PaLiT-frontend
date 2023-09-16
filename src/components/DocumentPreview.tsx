import { useFileStore } from '~/store/fileStore.ts'

export function DocumentPreview() {
    const fileStore = useFileStore()

    return (
        <div>
            <h2>Document preview</h2>
            <object
                className='resize'
                data={`http://localhost:8080/api/file/${fileStore.previewDocumentId}`}
                type='application/pdf'
                width='100%'
                height='800px'
            >
                <p>
                    It appears your web browser doesn't support embedding PDFs.
                    You can download the PDF{' '}
                    <a
                        href={`http://localhost:8080/api/file/${fileStore.previewDocumentId}`}
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
