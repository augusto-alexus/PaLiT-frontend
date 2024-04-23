import endpoints from './endpoints'
import { IStageDTO } from './stages'
import axios from './base.ts'
import { handleError } from '~/backend/error.ts'

export async function getStudentDocuments(studentId: string) {
    return axios
        .get(endpoints.files.getStudentDocuments(studentId))
        .then(({ data }) => data as IDocumentDTO[])
        .catch(handleError())
}

export async function uploadDocument(accessToken: string, studentId: number, document: File) {
    const formData = new FormData()
    formData.append('document', document)

    const response = await fetch(endpoints.files.uploadFile(studentId), {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return (await response.json()) as object
}

export async function uploadUserInvitationCsv(accessToken: string, document: File) {
    const formData = new FormData()
    formData.append('file', document)

    return fetch(endpoints.files.uploadCsv, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function reviewDocument(
    documentId: string,
    studentId: string,
    verdict: 'approved' | 'rejected',
    nextStageId?: number
) {
    const formData = new FormData()
    formData.append('isApproved', verdict === 'approved' ? 'true' : 'false')

    return axios
        .put(endpoints.files.reviewDocument(documentId), formData)
        .then(
            ({ data }) =>
                ({
                    ...data,
                    documentId,
                    studentId,
                    nextStageId,
                } as {
                    approved: string
                    documentId: string
                    studentId: string
                    nextStageId?: number
                })
        )
        .catch(handleError())
}

export async function moveDocumentToStage(documentId: string, stageId: number) {
    return axios
        .put(endpoints.files.moveToNextStage(documentId, stageId))
        .then(({ data }) => data as object)
        .catch(handleError())
}

export interface IDocumentDTO {
    documentId: number
    createdDate: string
    approved: boolean
    approvedDate: string
    originalName: string
    stageDTO: IStageDTO
}
