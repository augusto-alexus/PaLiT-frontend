import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getStudentDocuments, postComment, reviewDocument } from '~/backend'
import { toast } from '~/components'
import { useDocumentNextStage, useErrorHandler } from '~/hooks'
import { useTranslation } from 'react-i18next'

export function useAllStudentDocuments(studentId: string | undefined) {
    return useQuery({
        enabled: !!studentId,
        queryKey: ['studentDocuments', studentId],
        queryFn: async () => {
            if (!studentId) throw new Error('Trying to fetch document while student id is unknown')
            return getStudentDocuments(studentId)
        },
    })
}

export function useStudentDocument(studentId: string | null | undefined, documentId: string | null | undefined) {
    return useQuery({
        enabled: !!studentId && !!documentId,
        queryKey: ['studentDocuments', studentId, documentId],
        queryFn: async () => {
            if (!studentId || !documentId) throw new Error('Trying to fetch document while student id is unknown')
            const allDocuments = await getStudentDocuments(studentId)
            return allDocuments.find((d) => d.documentId.toString() === documentId)
        },
    })
}

export function useDocumentReview() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { mutate: moveDocumentToNextStage } = useDocumentNextStage()
    return useMutation({
        mutationFn: async ({
            documentId,
            studentId,
            verdict,
            nextStageId,
        }: {
            documentId: string
            studentId: string
            verdict: 'approved' | 'rejected'
            nextStageId?: number
        }) => reviewDocument(documentId, studentId, verdict, nextStageId),
        onSuccess: async ({ approved, documentId, nextStageId }) => {
            await queryClient.invalidateQueries(['studentDocuments'])
            if (approved === 'true') {
                nextStageId
                    ? moveDocumentToNextStage({ documentId, stageId: nextStageId })
                    : toast(t('feed.documentApproved'))
            } else toast(t('feed.documentRejected'))
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

export function useMakeComment() {
    const errorHandler = useErrorHandler()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ documentId, userId, comment }: { documentId: string; userId: string; comment: string }) =>
            postComment(documentId, userId, comment),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries(['documentComments', data])
            toast(t('feed.commentSaved'))
        },
        onError: errorHandler,
    })
}
