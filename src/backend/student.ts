import axios from 'axios'
import { Language, parseStudentDTO } from '~/models'
import { getAuthConfig } from './base'
import endpoints from './endpoints'
import { IStageDTO } from './stages'

export async function getAllStudents() {
    const response = await axios.get(endpoints.getAllStudents)
    return (response.data as IStudentDTO[]).map(parseStudentDTO)
}

export async function getMyProject(accessToken: string) {
    const response = await axios.get(
        endpoints.currentAdvisor,
        getAuthConfig(accessToken)
    )
    return parseMyProjectDTO(response.data as IMyProjectDTO)
}

function parseMyProjectDTO(dto: IMyProjectDTO): IMyProject {
    return {
        language: dto?.language
            ? dto.language === 'UA'
                ? 'Українська'
                : 'English'
            : undefined,
        theme: dto.theme,
        stage: dto.stageDTO,
        advisor: {
            id: dto?.teacherRequestDTO?.teacherId,
            firstName: dto?.teacherRequestDTO?.firstName,
            lastName: dto?.teacherRequestDTO?.lastName,
        },
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
