import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeam, editTeam } from '~/backend'
import { Language } from '~/models'
import { useErrorHandler } from '~/hooks/error.ts'

export function useCreateTeam(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}

export function useEditTeam(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ teacherId, studentId }: { teacherId: string; studentId: string }) =>
            editTeam(teacherId, studentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['allHoDRequests'])
            onSuccess?.()
        },
        onError: errorHandler,
    })
}
