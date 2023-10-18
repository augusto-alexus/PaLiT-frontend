import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export interface IDocumentDTO {
    documentId: number
    createdDate: string
    approved: string
    approvedDate: string
    originalName: string
    stageDTO?: any
}

export async function getStudentDocuments(studentId: number) {
    const response = await axios.get(
        endpoints.files.getStudentDocuments(studentId)
    )

    console.log(response)

    return response.data as IDocumentDTO[]
}

export async function uploadDocument(
    accessToken: string,
    studentId: number,
    document: File
) {
    const formData = new FormData()
    formData.append('document', document)

    const response = await fetch(endpoints.files.uploadFile(studentId), {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    console.log(response)

    return (await response.json()) as object
}

export async function reviewDocument(
    accessToken: string,
    documentId: number,
    verdict: 'approved' | 'rejected'
) {
    const formData = new FormData()
    formData.append('isApproved', verdict === 'approved' ? 'true' : 'false')

    const response = await axios.put(
        endpoints.files.reviewDocument(documentId),
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    return response.data as { approved: string }
}

export async function moveDocumentToStage(
    accessToken: string,
    documentId: number,
    stageId: number
) {
    const response = await axios.put(
        endpoints.files.moveToNextStage(documentId, stageId),
        undefined,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    console.log(response)

    return response.data as object
}
