import { useCheckIfStageMoveAllowed, useDocumentReview } from '~/hooks'
import { IDocumentDTO } from '~/backend'
import { Button } from '~/components'
import { useTranslation } from 'react-i18next'

export function RejectDocumentButton({ studentId, document }: { studentId: string; document: IDocumentDTO }) {
    const { t } = useTranslation()
    const { mutate: reviewDocument } = useDocumentReview()
    const isStageMoveAllowed = useCheckIfStageMoveAllowed()

    if (!isStageMoveAllowed(document.stageDTO.stageId, document.approvedDate)) return <></>

    return (
        <Button
            className='bg-cs-warning hover:bg-cs-secondary'
            title={t('feed.rejectDocument')}
            onClick={() =>
                reviewDocument({
                    documentId: document.documentId.toString(),
                    studentId,
                    verdict: 'rejected',
                })
            }
        >
            {t('feed.rejectDocument')}
        </Button>
    )
}
