import { Language, RequestDirection } from '~/models'

export interface IHoDRequestDTO {
    requestId: number
    teacherId: number
    studentId: number
    theme: string
    language: Language
    approved: boolean
    createdDate: string
    direction: RequestDirection
    headApprove: boolean
}
