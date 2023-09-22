import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export interface IDocumentDTO {
    documentId: string
    approved: string
    originalName: string
}

export function useGetStudentDocuments() {
    return (studentId: string) =>
        axios
            .get(endpoints.getStudentDocuments(studentId))
            .then(({ data }) => data as IDocumentDTO[])
}

export function useUploadDocument() {
    return async (studentId: string, document: File) => {
        const formData = new FormData()
        formData.append('document', document)

        const response = await fetch(endpoints.uploadFile(studentId), {
            method: 'POST',
            body: formData,
        })
        return (await response.json()) as object
    }
}
