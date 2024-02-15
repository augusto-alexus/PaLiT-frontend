import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTheme, updateTheme } from '~/backend'

export function useThemeUpdate(onSuccess?: () => void) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ studentId, newTheme }: { studentId: string; newTheme: string }) =>
            updateTheme(studentId, newTheme),
        onSuccess: async ({ studentId }) => {
            await queryClient.invalidateQueries(['myProject'])
            await queryClient.invalidateQueries(['theme', studentId])
            onSuccess?.()
        },
        onError: (err) => {
            console.log(err)
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
