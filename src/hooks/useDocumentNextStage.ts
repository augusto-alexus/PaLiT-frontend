import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { moveDocumentToStage } from '~/backend'
import { toast } from '~/components'
import { useAccessToken } from './useAccessToken'

export function useDocumentNextStage() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    return useMutation({
        mutationFn: async ({
            documentId,
            stageId,
        }: {
            documentId: number
            stageId: number
        }) => moveDocumentToStage(accessToken, documentId, stageId),
        onSuccess: () => {
            toast(t('feed.documentMovedToNextStage'))
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}
