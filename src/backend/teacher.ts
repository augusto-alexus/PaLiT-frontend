import { ITeacher, Language, parseMyStudentDTO } from '~/models'
import endpoints from './endpoints'
import { IStageDTO } from './stages'
import { IStudentDTO } from './student.ts'
import axios from './base.ts'
import { handleError } from '~/backend/error.ts'

export async function getAllTeachers() {
    return axios
        .get(endpoints.getAllTeachers)
        .then(({ data }) => data as ITeacher[])
        .catch(handleError())
}

export async function getMyStudents() {
    return axios
        .get(endpoints.currentStudents)
        .then(({ data }) => (data as IMyStudentDTO[])?.map(parseMyStudentDTO))
        .catch(handleError())
}

export interface IMyStudentDTO {
    language: Language
    theme: string
    stageDTO?: IStageDTO
    studentRequestDTO: IStudentDTO
}
