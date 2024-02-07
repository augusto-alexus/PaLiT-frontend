import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { getStudentDocuments, postComment, reviewDocument } from '~/backend'
import { toast } from '~/components'
import { useAccessToken, useCurrentUser, useDocumentNextStage } from '~/hooks'
import { IMyStudent } from '~/models'

export function useAllStudentDocuments(studentId: string | undefined) {
    return useQuery({
        enabled: !!studentId,
        queryKey: ['studentWork', studentId],
        queryFn: async () => {
            if (!studentId) throw new Error('Trying to fetch document while student id is unknown')
            return getStudentDocuments(studentId)
        },
    })
}

export function useStudentDocument(studentId: string | undefined, documentId: string | undefined) {
    return useQuery({
        enabled: !!studentId && !!documentId,
        queryKey: ['studentWork', studentId, documentId],
        queryFn: async () => {
            if (!studentId || !documentId) throw new Error('Trying to fetch document while student id is unknown')
            const allDocuments = await getStudentDocuments(studentId)
            return allDocuments.find((d) => d.documentId.toString() === documentId)
        },
    })
}

export function useDocumentReview() {
    const accessToken = useAccessToken()
    const { id } = useCurrentUser()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()
    const { mutate: moveDocumentToNextStage } = useDocumentNextStage()
    return useMutation({
        mutationFn: async ({
            documentId,
            verdict,
            nextStageId,
        }: {
            documentId: number
            verdict: 'approved' | 'rejected'
            nextStageId?: number
        }) => reviewDocument(accessToken, documentId, verdict, nextStageId),
        onSuccess: async ({ approved, documentId, nextStageId }) => {
            await queryClient.invalidateQueries([
                'studentDocuments',
                outletContext?.myStudent?.student?.studentId || id,
            ])
            if (approved === 'true') {
                moveDocumentToNextStage({ documentId, stageId: nextStageId })
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
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            documentId,
            stageId,
            studentId,
            teacherId,
            comment,
        }: {
            documentId: number
            stageId: number
            studentId: number
            teacherId: number
            comment: string
        }) => postComment(accessToken, documentId, stageId, studentId, teacherId, comment, role),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries(['documentComments', data])
            toast(t('feed.commentSaved'))
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
