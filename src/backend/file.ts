import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export interface IDocumentDTO {
    documentId: string
    approved: string
    originalName: string
}

export function useGetStudentDocuments() {
    return (studentId: number) =>
        axios
            .get(endpoints.getStudentDocuments(studentId))
            .then(({ data }) => data as IDocumentDTO[])
}

export function useUploadDocument(accessToken: string) {
    return async (studentId: number, document: File) => {
        const formData = new FormData()
        formData.append('document', document)

        const response = await fetch(endpoints.uploadFile(studentId), {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return (await response.json()) as object
    }
}
