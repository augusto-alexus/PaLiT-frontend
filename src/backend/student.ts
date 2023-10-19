import axios from 'axios'
import { IStageDTO } from '~/backend/stages.ts'
import endpoints from './endpoints'

export interface IStudentRequestDTO {
    studentId: number
    firstName: string
    lastName: string
    degree: string
    faculty: string
    cluster: string
}

function parseStudentRequest(data: IStudentRequestDTO[]) {
    return data.map((s) => ({
        ...s,
        degree: s.degree === 'BACHELOR' ? 'bachelor' : 'master',
    }))
}

export function useGetAllStudents(): () => Promise<IStudentRequestDTO[]> {
    return () =>
        axios
            .get(endpoints.getAllStudents)
            .then(({ data }) =>
                parseStudentRequest(data as IStudentRequestDTO[])
            )
}

interface IMyProjectDTO {
    language: 'UA' | 'ENG'
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

export async function getMyProject(accessToken: string) {
    const response = await axios.get(endpoints.currentAdvisor, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return parseMyProjectDTO(response.data as IMyProjectDTO)
}
