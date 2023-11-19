import { IStudentDTO } from '~/backend'

export type Degree = 'bachelor' | 'master'

export interface IStudent {
    studentId: number
    firstName: string
    lastName: string
    degree: Degree
    faculty: string
    cluster: string
}

export function parseStudentDTO(dto: IStudentDTO): IStudent {
    if (dto.degree !== 'BACHELOR' && dto.degree !== 'MASTER')
        throw new Error(`Unexpected StudentDTO degree: ${dto.degree}`)
    return {
        studentId: dto.studentId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        degree: dto.degree === 'BACHELOR' ? 'bachelor' : 'master',
        faculty: dto.faculty,
        cluster: dto.cluster,
    } as IStudent
}
