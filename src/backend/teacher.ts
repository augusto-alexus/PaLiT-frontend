import axios from 'axios'
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
    teacherRequestDTO: {
        teacherId: number
        firstName: string
        lastName: string
    }
}

interface IMyStudent {
    language: 'Українська' | 'English'
    theme: string
    advisor: {
        id: number
        firstName: string
        lastName: string
    }
}

function parseMyStudentDTO(dto: IMyStudentDTO): IMyStudent {
    return {
        language: dto.language === 'UA' ? 'Українська' : 'English',
        theme: dto.theme,
        advisor: {
            id: dto.teacherRequestDTO.teacherId,
            firstName: dto.teacherRequestDTO.firstName,
            lastName: dto.teacherRequestDTO.lastName,
        },
    }
}

export async function getMyStudents(accessToken: string) {
    return axios
        .get(endpoints.currentStudents, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(({ data }) => data as object) //parseMyStudentDTO(data as IMyStudentDTO))
}
