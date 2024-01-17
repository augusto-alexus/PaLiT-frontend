import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
    approveStageForAll,
    approveStageForTeacher,
    getAllStages,
    getTeachersStages,
    moveDocumentToStage,
    restrictStageForAll,
    restrictStageForTeacher,
} from '~/backend'
import { toast } from '~/components'
import { useAccessToken } from '~/hooks'

export function useAllStages() {
    const accessToken = useAccessToken()
    return useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(accessToken),
    })
}

export function useGetTeacherStages(teacherId: number) {
    const accessToken = useAccessToken()
    return useQuery({
        queryKey: ['teacherStages', teacherId],
        queryFn: () => getTeachersStages(accessToken, teacherId),
    })
}

export function useApproveStageForTeacher() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            teacherId,
            stageId,
        }: {
            teacherId: number
            stageId: number
        }) => approveStageForTeacher(accessToken, teacherId, stageId),
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
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            teacherId,
            stageId,
        }: {
            teacherId: number
            stageId: number
        }) => restrictStageForTeacher(accessToken, teacherId, stageId),
        onSuccess: async (teacherId) => {
            await queryClient.invalidateQueries(['teacherStages', teacherId])
            toast(t('dashboard.stageApprovedForTeacher'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
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
            toast(t('dashboard.stageApprovedForAll'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useRestrictStageForAll() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ stageId }: { stageId: number }) =>
            restrictStageForAll(accessToken, stageId),
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
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            documentId,
            stageId,
        }: {
            documentId: number
            stageId: number
        }) => moveDocumentToStage(accessToken, documentId, stageId),
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
