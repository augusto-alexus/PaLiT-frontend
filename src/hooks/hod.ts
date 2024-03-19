import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeam } from '~/backend'
import { Language } from '~/models'

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
            console.error('~~~>', error)
            onError?.(error?.toString())
        },
    })
}
