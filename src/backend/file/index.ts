import axios from 'axios'
import { toast } from '~/components'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export interface IDocumentDTO {
    documentId: string
    contentId: string
    studentId: string
    approved: string
}

export interface IStudentFileInfoDTO {
    documentId: string
    approved: boolean
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
            .then(({ data }) => data)
            .catch((err) => toast(`Error! ${err}`))
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
            .then((data) => console.log(data))
            .catch((error) => console.log('error', error))
    }
}
