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
    return axios
        .get(endpoints.currentStudents, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(({ data }) => (data as IMyStudentDTO[])?.map(parseMyStudentDTO))
}
