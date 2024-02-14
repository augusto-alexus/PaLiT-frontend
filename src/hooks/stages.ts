import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
    approveStageForAllInRole,
    approveStageForTeacher,
    getAllStages,
    getTeachersStages,
    moveDocumentToStage,
    restrictStageForAll,
    restrictStageForTeacher,
} from '~/backend'
import { toast } from '~/components'

export function useAllStages() {
    return useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(),
    })
}

export function useGetTeacherStages(teacherId: number) {
    return useQuery({
        queryKey: ['teacherStages', teacherId],
        queryFn: () => getTeachersStages(teacherId),
    })
}

export function useApproveStageForTeacher() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ teacherId, stageId }: { teacherId: number; stageId: number }) =>
            approveStageForTeacher(teacherId, stageId),
        onSuccess: async (teacherId) => {
            await queryClient.invalidateQueries(['teacherStages', teacherId])
            toast(t('dashboard.stageApprovedForTeacher'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useRestrictStageForTeacher() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ teacherId, stageId }: { teacherId: number; stageId: number }) =>
            restrictStageForTeacher(teacherId, stageId),
        onSuccess: async (teacherId) => {
            await queryClient.invalidateQueries(['teacherStages', teacherId])
            toast(t('dashboard.stageRestrictedForTeacher'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useApproveStageForAll() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ stageId, roleId }: { stageId: number; roleId: string }) =>
            approveStageForAllInRole(stageId, roleId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['teacherStages'])
            toast(t('dashboard.stageApprovedForAll'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useRestrictStageForAll() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ stageId, roleId }: { stageId: number; roleId: string }) =>
            restrictStageForAll(stageId, roleId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['teacherStages'])
            toast(t('dashboard.stageRestrictedForAll'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useDocumentNextStage() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ documentId, stageId }: { documentId: string; stageId: number }) =>
            moveDocumentToStage(documentId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['studentDocuments'])
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
