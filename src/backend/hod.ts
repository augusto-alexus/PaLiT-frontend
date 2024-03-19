import { IHoDRequest, Language, parseHoDRequestDTO, RequestDirection } from '~/models'
import endpoints from './endpoints'
import axios from './base.ts'

export async function getAllRequests(): Promise<IHoDRequest[]> {
    const response = await axios.get(endpoints.hod.getAllRequests)
    return (response.data as IHoDRequestDTO[]).map(parseHoDRequestDTO)
}

export function createTeam(studentId: string, teacherId: string, theme: string, language: Language) {
    return axios.post(endpoints.hod.createTeam(teacherId, studentId), {
        theme,
        language,
        approveDirection: 'TEACHER',
    })
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
