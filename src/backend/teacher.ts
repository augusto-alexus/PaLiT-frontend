import axios from 'axios'
import { IStageDTO } from '~/backend/stages.ts'
import endpoints from './endpoints'

export interface ITeacherRequestDTO {
    teacherId: number
    firstName: string
    lastName: string
}

export function useGetAllTeachers() {
    return () =>
        axios
            .get(endpoints.getAllTeachers)
            .then(({ data }) => data as ITeacherRequestDTO[])
}

interface IMyStudentDTO {
    language: 'UA' | 'ENG'
    theme: string
    stageDTO?: IStageDTO
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

function parseMyStudentDTO(dto: IMyStudentDTO): IMyStudent {
    return {
        language: dto.language === 'UA' ? 'Українська' : 'English',
        theme: dto.theme,
        stage: dto.stageDTO,
        student: {
            ...dto.studentRequestDTO,
            degree:
                dto.studentRequestDTO.degree === 'BACHELOR'
                    ? 'bachelor'
                    : 'master',
        },
    }
}

export async function getMyStudents(accessToken: string) {
    const response = await axios.get(endpoints.currentStudents, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return (response.data as IMyStudentDTO[])?.map(parseMyStudentDTO)
}
