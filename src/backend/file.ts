import axios from 'axios'
import { getAuthConfig } from './base'
import endpoints from './endpoints'
import { IStageDTO } from './stages'

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

export async function reviewDocument(
    accessToken: string,
    documentId: number,
    verdict: 'approved' | 'rejected',
    nextStageId?: number
) {
    const formData = new FormData()
    formData.append('isApproved', verdict === 'approved' ? 'true' : 'false')

    const response = await axios.put(endpoints.files.reviewDocument(documentId), formData, getAuthConfig(accessToken))

    return { ...response.data, documentId, nextStageId } as {
        approved: string
        documentId: number
        nextStageId: number
    }
}

export async function moveDocumentToStage(accessToken: string, documentId: number, stageId: number) {
    const response = await axios.put(
        endpoints.files.moveToNextStage(documentId, stageId),
        undefined,
        getAuthConfig(accessToken)
    )
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
