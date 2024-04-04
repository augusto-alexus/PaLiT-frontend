import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeam, editTeam } from '~/backend'
import { Language } from '~/models'
import { AxiosError } from 'axios'
import { toast } from '~/components'
import { useTranslation } from 'react-i18next'

export function useCreateTeam(onSuccess?: () => void, onError?: (err?: string) => void) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            teacherId,
            studentId,
            theme,
            language,
        }: {
            teacherId: string
            studentId: string
            theme: string
            language: Language
        }) => createTeam(teacherId, studentId, theme, language),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['allHoDRequests'])
            onSuccess?.()
        },
        onError: (error) => {
            onError?.(error?.toString())
        },
    })
}

export function useEditTeam(onSuccess?: () => void) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ teacherId, studentId }: { teacherId: string; studentId: string }) =>
            editTeam(teacherId, studentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['allHoDRequests'])
            onSuccess?.()
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    toast(`${t('error.inviteLimitTeacher')}!`)
                } else {
                    toast(`${t('unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('unknownError')}!`)
            }
        },
    })
}
