import { ICurrentUserDTO } from '~/backend'

export type Role = 'student' | 'teacher' | 'HoD'

export interface ICurrentUser {
    id: number
    studentId?: number
    teacherId?: number
    firstName: string
    lastName: string
    email: string
    role: Role
    degree?: 'bachelor' | 'master'
    bachelorStudentsLimit?: number
    masterStudentsLimit?: number
    allowedStageIds?: number[]
}

export function getCurrentUserFromDTO(dto: ICurrentUserDTO): ICurrentUser {
    const role = dto.roleDTO.name
    if (role !== 'teacher' && role !== 'student' && role !== 'HoD')
        throw new Error('Unrecognized role for current user')
    const degree = dto.studentDTO?.degree.toLowerCase()
    if (degree !== undefined && degree !== 'bachelor' && degree !== 'master')
        throw new Error('Unrecognized degree for current user')
    return {
        id: dto.userId,
        studentId: dto.studentDTO?.studentId,
        teacherId: dto.teacherDTO?.teacherId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        role,
        degree,
        bachelorStudentsLimit: dto.teacherDTO?.generalBachelor,
        masterStudentsLimit: dto.teacherDTO?.generalMaster,
        allowedStageIds: dto.teacherDTO?.availableStageIdSet,
    }
}
