import axios from 'axios'
import { IStageDTO } from '~/backend/stages.ts'
import endpoints from './endpoints'

export async function getAllTeachers() {
    const response = await axios.get(endpoints.getAllTeachers)
    return response.data as ITeacherRequestDTO[]
}

export async function getMyStudents(accessToken: string) {
    const response = await axios.get(endpoints.currentStudents, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return (response.data as IMyStudentDTO[])?.map(parseMyStudentDTO)
}

function parseMyStudentDTO(dto: IMyStudentDTO): IMyStudent {
    return {
        language: dto.language === 'UA' ? 'Українська' : 'English',
        theme: dto.theme,
        stage: dto.stageDTO,
        headApproved: !!dto.headApprove,
        student: {
            ...dto.studentRequestDTO,
            degree:
                dto.studentRequestDTO.degree === 'BACHELOR'
                    ? 'bachelor'
                    : 'master',
        },
    }
}

export interface ITeacherRequestDTO {
    teacherId: number
    firstName: string
    lastName: string
}

interface IMyStudentDTO {
    language: 'UA' | 'ENG'
    theme: string
    stageDTO?: IStageDTO
    headApprove: boolean | null
    studentRequestDTO: {
        studentId: number
        cluster: string
        degree: string
        faculty: string
        firstName: string
        lastName: string
        graduateDate: string
    }
}

export interface IMyStudent {
    language: 'Українська' | 'English'
    theme: string
    stage?: IStageDTO
    headApproved: boolean
    student: {
        studentId: number
        cluster: string
        degree: string
        faculty: string
        firstName: string
        lastName: string
        graduateDate: string
    }
}
