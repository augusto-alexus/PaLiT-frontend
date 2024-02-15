import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTheme, updateTheme } from '~/backend'
import { AxiosError } from 'axios'
import { toast } from '~/components'
import { useTranslation } from 'react-i18next'

export function useThemeUpdate(onEnd?: () => void) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ studentId, newTheme }: { studentId: string; newTheme: string }) =>
            updateTheme(studentId, newTheme),
        onSuccess: async ({ studentId }) => {
            await queryClient.invalidateQueries(['myProject'])
            await queryClient.invalidateQueries(['theme', studentId])
            onEnd?.()
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                if (error?.response?.status === 403) {
                    toast(`${t('error.youCantUpdateTheme')}!`)
                } else toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
            onEnd?.()
        },
    })
}

export function useGetTheme(studentId?: string | null) {
    return useQuery({
        enabled: !!studentId,
        queryKey: ['theme', studentId],
        queryFn: () => getTheme(studentId!),
    })
}
