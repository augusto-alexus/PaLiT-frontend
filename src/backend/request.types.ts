import { Language, RequestDirection } from '~/models'

interface IRequestBase {
    requestId: number
    createdDate: string
    theme: string
    language: Language
    approved: boolean
    direction: RequestDirection
}

export interface IRequestStudent extends IRequestBase {
    studentRequestDTO: {
        studentId: number
        degree: 'BACHELOR' | 'MASTER'
        faculty: string
        firstName: string
        lastName: string
        cluster: string
        graduateDate: string
    }
}

export interface IRequestTeacher extends IRequestBase {
    teacherRequestDTO: {
        teacherId: number
        firstName: string
        lastName: string
    }
}

export interface IRequestUser {
    id: number
    firstName: string
    lastName: string
    degree?: 'bachelor' | 'master'
    faculty?: string
    cluster?: string
    graduateDate?: string
}

export interface IRequest extends IRequestBase {
    user: IRequestUser
}

interface IRequestBody {
    theme: string
    language: Language
}

export interface IRequestDTO {
    accessToken: string
    userId: number
    requestBody: IRequestBody
}
