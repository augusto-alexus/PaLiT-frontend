import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface IFileStoreState {
    previewDocumentId: string | null
    setPreviewDocumentId: (documentId: string) => void
    reset: () => void
}

export const useFileStore = create<IFileStoreState>()(
    persist(
        devtools(
            (set) => ({
                previewDocumentId: null,
                setPreviewDocumentId: (documentId: string) =>
                    set(
                        () => ({ previewDocumentId: documentId }),
                        false,
                        'setPreviewDocumentId'
                    ),
                reset: () =>
                    set(() => ({ previewDocumentId: null }), false, 'reset'),
            }),
            { name: 'File Store' }
        ),
        {
            name: 'file-storage',
        }
    )
)
