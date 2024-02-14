import { useAllStages, useCheckIfStageMoveAllowed, useDocumentReview } from '~/hooks'
import { IDocumentDTO } from '~/backend'
import { Button, Loading } from '~/components'
import { useTranslation } from 'react-i18next'

export function ApproveDocumentButton({ studentId, document }: { studentId: string; document: IDocumentDTO }) {
    const { t } = useTranslation()
    const { data: stages, isInitialLoading } = useAllStages()
    const { mutate: reviewDocument } = useDocumentReview()
    const isStageMoveAllowed = useCheckIfStageMoveAllowed()

    if (isInitialLoading) return <Loading />

    const nextStage = stages?.find((s) => s.serialOrder - 1 === document.stageDTO.serialOrder)

    if (!isStageMoveAllowed(document.stageDTO.stageId, document.approvedDate)) return <></>

    return (
        <Button
            className='bg-cs-accent-green hover:bg-cs-secondary'
            title={t('feed.approveDocument')}
            onClick={() =>
                reviewDocument({
                    documentId: document.documentId.toString(),
                    studentId,
                    verdict: 'approved',
                    nextStageId: nextStage?.stageId,
                })
            }
        >
            {t('feed.approveDocument')}
        </Button>
    )
}
