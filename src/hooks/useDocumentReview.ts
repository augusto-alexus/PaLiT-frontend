import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { reviewDocument } from '~/backend'
import { toast } from '~/components'
import { IMyStudent } from '~/models'
import { useAccessToken } from './useAccessToken'
import { useCurrentUser } from './useCurrentUser'

export function useDocumentReview() {
    const accessToken = useAccessToken()
    const { id } = useCurrentUser()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()
    return useMutation({
        mutationFn: async ({
            documentId,
            verdict,
        }: {
            documentId: number
            verdict: 'approved' | 'rejected'
        }) => reviewDocument(accessToken, documentId, verdict),
        onSuccess: async ({ approved }) => {
            await queryClient.invalidateQueries([
                'studentDocuments',
                outletContext?.myStudent?.student?.studentId || id,
            ])
            if (approved === 'true') toast(t('feed.documentApproved'))
            else toast(t('feed.documentRejected'))
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
