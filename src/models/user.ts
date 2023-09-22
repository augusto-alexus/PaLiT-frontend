import { ICurrentUserDTO } from '~/backend/auth.types.ts'

export interface ICurrentUser {
    id: number
    studentId?: string
    firstName: string
    lastName: string
    email: string
    role: 'student' | 'teacher'
    degree?: 'bachelor' | 'master'
}

export function getCurrentUserFromDTO(dto: ICurrentUserDTO): ICurrentUser {
    const role = dto.roleDTO.name
    if (role !== 'teacher' && role !== 'student')
        throw new Error('Unrecognized role for current user')
    const degree = dto.studentDTO?.degree.toLowerCase()
    if (degree !== undefined && degree !== 'bachelor' && degree !== 'master')
        throw new Error('Unrecognized degree for current user')
    return {
        id: dto.userId,
        studentId: dto.studentDTO?.studentId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        role,
        degree,
    }
}
