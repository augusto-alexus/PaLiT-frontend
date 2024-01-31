import axios from 'axios'
import { ITeacher, Language, parseMyStudentDTO } from '~/models'
import { getAuthConfig } from './base'
import endpoints from './endpoints'
import { IStageDTO } from './stages'
import { IStudentDTO } from './student.ts'

export async function getAllTeachers() {
    const response = await axios.get(endpoints.getAllTeachers)
    return response.data as ITeacher[]
}

export async function getMyStudents(accessToken: string) {
    const response = await axios.get(
        endpoints.currentStudents,
        getAuthConfig(accessToken)
    )
    return (response.data as IMyStudentDTO[])?.map(parseMyStudentDTO)
}

export interface IMyStudentDTO {
    language: Language
    theme: string
    stageDTO?: IStageDTO
    studentRequestDTO: IStudentDTO
}
