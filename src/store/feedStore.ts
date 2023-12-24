import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IFeedState {
    selectedStage: number | null
    setSelectedStage: (stageId: number) => void
    showCommentsForDocumentId: number | null
    setShowCommentsForDocumentId: (documentId: number) => void
    reset: () => void
}

export const useFeedStore = create<IFeedState>()(
    persist(
        devtools(
            (set) => ({
                selectedStage: null,
                setSelectedStage: (stageId: number) =>
                    set(
                        () => ({ selectedStage: stageId }),
                        false,
                        'setSelectedStage'
                    ),
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
                        () => ({
                            selectedStage: null,
                            showCommentsForDocumentId: null,
                        }),
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
