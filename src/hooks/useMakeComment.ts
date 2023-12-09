import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { postComment } from '~/backend'
import { toast } from '~/components'
import { useAccessToken } from './useAccessToken'
import { useCurrentUser } from './useCurrentUser'

export function useMakeComment() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            documentId,
            studentId,
            teacherId,
            comment,
        }: {
            documentId: number
            studentId: number
            teacherId: number
            comment: string
        }) =>
            postComment(
                accessToken,
                documentId,
                studentId,
                teacherId,
                comment,
                role
            ),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries(['documentComments', data])
            toast(t('feed.commentSaved'))
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
