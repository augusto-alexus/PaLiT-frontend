import axios from 'axios'
import { toast } from '~/components'

export interface IDocumentDTO {
    documentId: string
    approved: string
    originalName: string
}

export function useGetDocumentById() {
    return (documentId: string) => {
        axios
            .get(`http://localhost:8080/api/file/${documentId}`)
            .then(({ data }) => {
                console.log(data)
            })
            .catch((err) => {
                toast(`Error! ${err}`)
            })
    }
}

export function useGetStudentDocuments() {
    return (studentId: string) =>
        axios
            .get(`http://localhost:8080/api/student/${studentId}/file-info`)
            .then(({ data }) => data as IDocumentDTO[])
            .catch((err) => {
                toast(`Error while getting student files: ${err}`)
                return [] as IDocumentDTO[]
            })
}

export function useUploadDocument() {
    return (studentId: string, document: File) => {
        const formData = new FormData()
        formData.append('document', document)

        fetch(`http://localhost:8080/api/file/student/${studentId}`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then(() => toast('File uploaded successfully!'))
            .catch((error) => toast(`Error during file upload: ${error}`))
    }
}
