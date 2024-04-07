import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
    approveStageForAllInRole,
    approveStageForTeacher,
    createRoleStageApproval,
    deleteRoleStageApproval,
    getAllRoleStageApprovals,
    getAllStages,
    getTeachersStages,
    moveDocumentToStage,
    restrictStageForAll,
    restrictStageForTeacher,
} from '~/backend'
import { toast } from '~/components'
import { useCurrentUser } from '~/hooks/auth.ts'

export function useAllStages() {
    return useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(),
    })
}

export function useAllRoleStageApprovals() {
    return useQuery({
        queryKey: ['role-stages'],
        queryFn: () => getAllRoleStageApprovals(),
    })
}

export function useCreateRoleStageApproval() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ roleId, stageId }: { roleId: string; stageId: string }) =>
            createRoleStageApproval(roleId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['role-stages'])
            toast(t('dashboard.stageApproved'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useDeleteRoleStageApproval() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ roleId, stageId }: { roleId: string; stageId: string }) =>
            deleteRoleStageApproval(roleId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['role-stages'])
            toast(t('dashboard.stageRestricted'))
        },
        onError: () => {
            toast(`${t('error.unknownError')}!`)
        },
    })
}

export function useGetTeacherStages(teacherId: number) {
    return useQuery({
        queryKey: ['teacherStages', teacherId],
        queryFn: () => getTeachersStages(teacherId),
    })
}

export function useCheckIfStageMoveAllowed() {
    const { role, allowedStageIds } = useCurrentUser()
    return (docStageId: number, docApprovedDate: string | null | undefined): boolean => {
        const roleAllowed = role !== 'student'
        const stageAllowed = allowedStageIds?.includes(docStageId) ?? false
        const alreadyReviewed = !!docApprovedDate
        return roleAllowed && stageAllowed && !alreadyReviewed
    }
}

export function useApproveStageForTeacher() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ teacherId, stageId }: { teacherId: number; stageId: number }) =>
            approveStageForTeacher(teacherId, stageId),
        onSuccess: async (teacherId) => {
            await queryClient.invalidateQueries(['teacherStages', teacherId])
            await queryClient.invalidateQueries(['currentUser'])
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
            await queryClient.invalidateQueries(['currentUser'])
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
            await queryClient.invalidateQueries(['currentUser'])
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
            await queryClient.invalidateQueries(['currentUser'])
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
