import { IHoDRequestDTO } from '~/backend'
import { Language } from './common'

export type RequestDirection = 'STUDENT' | 'TEACHER'

export function parseHoDRequestDTO(dto: IHoDRequestDTO): IHoDRequest {
    return {
        id: dto.requestId,
        teacherId: dto.teacherId,
        studentId: dto.studentId,
        theme: dto.theme,
        language: dto.language,
        createdAt: dto.createdDate,
        direction: dto.direction,
        teamApproved: dto.approved,
    }
}

export interface IHoDRequest {
    id: number
    teacherId: number
    studentId: number
    theme: string
    language: Language
    createdAt: string
    direction: RequestDirection
    teamApproved: boolean
}
