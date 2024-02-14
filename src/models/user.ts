import { IFullUserInfoDTO } from '~/backend'

export type Role = 'student' | 'teacher' | 'HoD' | 'PS'

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

export function getCurrentUserFromDTO(dto: IFullUserInfoDTO): ICurrentUser {
    const role = dto.roleDTO.name
    if (role !== 'teacher' && role !== 'student' && role !== 'HoD' && role !== 'PS')
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

export interface IUserUpdateForm {
    lastName: string
    firstName: string
    email: string
    password: string
    confirmPassword: string
    roleId: string
    degree: string
    group: string
    faculty: string
    gradYear: string
    bachelorStudentLimit: number
    masterStudentLimit: number
}
