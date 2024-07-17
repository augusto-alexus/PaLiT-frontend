import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { useErrorHandler } from '~/hooks/error.ts'
import { useMyStudents } from '~/hooks/teachers.ts'

export function useAllStages() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['stages'],
        queryFn: () => getAllStages(),
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useAllRoleStageApprovals() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['role-stages'],
        queryFn: () => getAllRoleStageApprovals(),
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useCreateRoleStageApproval() {
    const errorHandler = useErrorHandler()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ roleId, stageId }: { roleId: string; stageId: string }) =>
            createRoleStageApproval(roleId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['role-stages'])
            await queryClient.invalidateQueries(['currentUser'])
            toast(t('dashboard.stageApproved'))
        },
        onError: errorHandler,
    })
}

export function useDeleteRoleStageApproval() {
    const errorHandler = useErrorHandler()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ roleId, stageId }: { roleId: string; stageId: string }) =>
            deleteRoleStageApproval(roleId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['role-stages'])
            await queryClient.invalidateQueries(['currentUser'])
            toast(t('dashboard.stageRestricted'))
        },
        onError: errorHandler,
    })
}

export function useGetTeacherStages(teacherId: number) {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryKey: ['teacherStages', teacherId],
        queryFn: () => getTeachersStages(teacherId),
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useApproveStageForTeacher() {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}

export function useRestrictStageForTeacher() {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}

export function useApproveStageForAll() {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}

export function useRestrictStageForAll() {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}

export function useDocumentNextStage() {
    const errorHandler = useErrorHandler()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ documentId, stageId }: { documentId: string; stageId: number }) =>
            moveDocumentToStage(documentId, stageId),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['studentDocuments'])
            toast(t('feed.documentMovedToNextStage'))
        },
        onError: errorHandler,
    })
}

export function useCheckIfStageMoveAllowed() {
    const { role, allowedStageIds } = useCurrentUser()
    const { data: myStudents } = useMyStudents()
    return (
        studentId: string,
        docStageId: number,
        docStageSerialOrder: number,
        docApprovedDate: string | null | undefined
    ): boolean => {
        const roleAllowed = role !== 'student'
        const stageAllowed = allowedStageIds?.includes(docStageId) ?? false
        const alreadyReviewed = !!docApprovedDate
        return (
            roleAllowed &&
            (stageAllowed ||
                (docStageSerialOrder === 1 &&
                    (myStudents?.some((st) => st.student.studentId.toString() === studentId) ?? false))) &&
            !alreadyReviewed
        )
    }
}
