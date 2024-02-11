import endpoints from './endpoints'
import { IStageDTO } from './stages'
import axios from './base.ts'

export async function getStudentDocuments(studentId: string) {
    const response = await axios.get(endpoints.files.getStudentDocuments(studentId))

    return response.data as IDocumentDTO[]
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

export async function reviewDocument(documentId: number, verdict: 'approved' | 'rejected', nextStageId?: number) {
    const formData = new FormData()
    formData.append('isApproved', verdict === 'approved' ? 'true' : 'false')

    const response = await axios.put(endpoints.files.reviewDocument(documentId), formData)

    return { ...response.data, documentId, nextStageId } as {
        approved: string
        documentId: number
        nextStageId: number
    }
}

export async function moveDocumentToStage(documentId: number, stageId: number) {
    const response = await axios.put(endpoints.files.moveToNextStage(documentId, stageId))
    return response.data as object
}

export interface IDocumentDTO {
    documentId: number
    createdDate: string
    approved: boolean
    approvedDate: string
    originalName: string
    stageDTO?: IStageDTO
}
