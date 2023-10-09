import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IFeedState {
    showCommentsForDocumentId: number | null
    setShowCommentsForDocumentId: (documentId: number) => void
    reset: () => void
}

export const useFeedStore = create<IFeedState>()(
    persist(
        devtools(
            (set) => ({
                showCommentsForDocumentId: null,
                setShowCommentsForDocumentId: (documentId: number) =>
                    set(
                        (prev) => ({
                            showCommentsForDocumentId:
                                prev.showCommentsForDocumentId === documentId
                                    ? null
                                    : documentId,
                        }),
                        false,
                        'setShowCommentsForDocumentId'
                    ),
                reset: () =>
                    set(
                        () => ({ showCommentsForDocumentId: null }),
                        false,
                        'reset'
                    ),
            }),
            { name: 'Feed Store' }
        ),
        {
            name: 'feed-storage',
        }
    )
)
