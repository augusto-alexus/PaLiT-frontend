import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTheme, updateTheme } from '~/backend'
import { useErrorHandler } from '~/hooks/error.ts'

export function useThemeUpdate(onEnd?: () => void) {
    const errorHandler = useErrorHandler()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ studentId, newTheme }: { studentId: string; newTheme: string }) =>
            updateTheme(studentId, newTheme),
        onSuccess: async ({ studentId }) => {
            await queryClient.invalidateQueries(['myProject'])
            await queryClient.invalidateQueries(['theme', studentId])
        },
        onError: errorHandler,
        onSettled: () => onEnd?.(),
    })
}

export function useGetTheme(studentId?: string | null) {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: !!studentId,
        queryKey: ['theme', studentId],
        queryFn: () => getTheme(studentId!),
    })
    if (query.isError) errorHandler(query.error)
    return query
}
