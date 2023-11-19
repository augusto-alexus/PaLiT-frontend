import axios from 'axios'
import { IStageDTO } from '~/backend/stages.ts'
import { Language } from '~/models/request.ts'
import { parseStudentDTO } from '~/models/student.ts'
import endpoints from './endpoints'

export async function getAllStudents() {
    const response = await axios.get(endpoints.getAllStudents)
    return (response.data as IStudentDTO[]).map(parseStudentDTO)
}

export async function getMyProject(accessToken: string) {
    const response = await axios.get(endpoints.currentAdvisor, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
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
        headApproved: !!dto.headApprove,
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
    headApprove: boolean | null
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
    headApproved: boolean
    advisor: {
        id: number
        firstName: string
        lastName: string
    }
}
