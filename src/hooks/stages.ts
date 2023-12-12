import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
    approveStageForAll,
    getAllStages,
    getTeachersStages,
    moveDocumentToStage,
} from '~/backend'
import { toast } from '~/components'
import { useAccessToken } from '~/hooks'
import { ITeacher } from '~/models'

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
