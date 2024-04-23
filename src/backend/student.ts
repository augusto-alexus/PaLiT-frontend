import { Language, parseStudentDTO } from '~/models'
import endpoints from './endpoints'
import { IStageDTO } from './stages'
import axios from './base.ts'
import { handleError } from '~/backend/error.ts'

export async function getAllStudents() {
    return axios
        .get(endpoints.getAllStudents)
        .then(({ data }) => (data as IStudentDTO[]).map(parseStudentDTO))
        .catch(handleError())
}

export async function getMyProject() {
    return axios
        .get(endpoints.currentAdvisor)
        .then(({ data }) => parseMyProjectDTO(data as IMyProjectDTO))
        .catch(handleError())
}

export async function getAllStudentsWithInfo() {
    return axios
        .get(endpoints.student.getAllStudentsWithStatus)
        .then(({ data }) => data as IHodStudentInfo[])
        .catch(handleError())
}

function parseMyProjectDTO(dto: IMyProjectDTO): IMyProject {
    return {
        language: dto?.language ? (dto.language === 'UA' ? 'Українська' : 'English') : undefined,
        theme: dto.theme,
        stage: dto.stageDTO,
        advisor: {
            id: dto?.teacherRequestDTO?.teacherId,
            firstName: dto?.teacherRequestDTO?.firstName,
            lastName: dto?.teacherRequestDTO?.lastName,
        },
    }
}

export interface IHodStudentInfo {
    userDTO: {
        userId: string
        firstName: string
        lastName: string
        email: string
    }
    studentDTO: {
        studentId: string
        degree: 'BACHELOR' | 'MASTER' | string
        cluster: string
        faculty: string
        graduateDate: string
    }
    documentDTO: {
        documentId: string
        approved: string
        originalName: string
        stageDTO: {
            stageId: number
            serialOrder: number
            name: string
        }
        approvedDate: string | null
        createdDate: string
    }
}

export interface IStudentDTO {
    studentId: number
    firstName: string
    lastName: string
    degree: 'BACHELOR' | 'MASTER' | string
    faculty: string
    cluster: string
}

interface IMyProjectDTO {
    language: Language
    theme: string
    stageDTO?: IStageDTO
    teacherRequestDTO: {
        teacherId: number
        firstName: string
        lastName: string
    }
}

export interface IMyProject {
    language?: 'Українська' | 'English'
    theme: string
    stage?: IStageDTO
    advisor: {
        id: number
        firstName: string
        lastName: string
    }
}
