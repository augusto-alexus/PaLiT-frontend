import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'
import { IRoleDTO } from '~/backend/auth.ts'

export async function getAllUsers() {
    const response = await axios.get(endpoints.user.getAll)
    return response.data as IUser[]
}

export async function getUserById(id: string) {
    const response = await axios.get(endpoints.user.getById(id))
    return response.data as IFullUserInfoDTO
}

export interface IUser {
    userId: number
    email: string
    firstName: string
    lastName: string
}

export interface IFullUserInfoDTO {
    firstName: string
    lastName: string
    email: string
    userId: number
    roleDTO: IRoleDTO
    studentDTO?: IStudentDTO
    teacherDTO?: ITeacherDTO
}

interface IStudentDTO {
    studentId: number
    degree: string
    cluster: string
    faculty: string
    graduateDate: string
}

interface ITeacherDTO {
    teacherId: number
    generalBachelor: number
    generalMaster: number
    availableStageIdSet: number[]
}
