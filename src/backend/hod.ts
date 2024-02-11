import { IHoDRequest, Language, parseHoDRequestDTO, RequestDirection } from '~/models'
import endpoints from './endpoints'
import axios from './base.ts'

export async function getAllRequests(): Promise<IHoDRequest[]> {
    const response = await axios.get(endpoints.hod.getAllRequests)
    return (response.data as IHoDRequestDTO[]).map(parseHoDRequestDTO)
}

export async function updateRequest(requestId: number, approved: boolean): Promise<[boolean, boolean]> {
    const formData = new FormData()
    formData.append('approved', String(approved))
    const response = await axios.put(endpoints.hod.updateRequest(requestId), formData)
    return [response.status === 200, approved]
}

export interface IHoDRequestDTO {
    requestId: number
    teacherId: number
    studentId: number
    theme: string
    language: Language
    approved: boolean
    createdDate: string
    direction: RequestDirection
}
