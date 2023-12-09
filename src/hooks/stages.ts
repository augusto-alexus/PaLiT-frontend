import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { approveStageForAll, getAllStages, getTeachersStages } from '~/backend'
import { toast } from '~/components'
import { ITeacher } from '~/models'
import { useAccessToken } from './useAccessToken'

export function useAllStages() {
    const accessToken = useAccessToken()
    return useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(accessToken),
    })
}

export function useGetTeacherStages(teacher: ITeacher) {
    const accessToken = useAccessToken()
    return useQuery({
        queryKey: ['teacherStages', teacher.teacherId],
        queryFn: () => getTeachersStages(accessToken, teacher.teacherId),
    })
}

export function useApproveStageForAll() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ stageId }: { stageId: number }) =>
            approveStageForAll(accessToken, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['teacherStages'])
            toast(t('feed.documentApproved'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}
