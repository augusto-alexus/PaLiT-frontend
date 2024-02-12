import endpoints from './endpoints'
import { IRoleDTO, IStudentSignUpDTO, ITeacherSignUpDTO } from './auth'
import axios from './base.ts'

export async function getAllUsers() {
    const response = await axios.get(endpoints.user.getAll)
    return response.data as IUser[]
}

export async function getUserById(id: string) {
    const response = await axios.get(endpoints.user.getById(id))
    return response.data as IFullUserInfoDTO
}

export async function createStudent(studentCreate: IStudentSignUpDTO) {
    const response = await axios.post(endpoints.user.createStudent, studentCreate)
    return response.data as object
}

export async function createTeacher(teacherCreate: ITeacherSignUpDTO) {
    const response = await axios.post(endpoints.user.createTeacher, teacherCreate)
    return response.data as object
}

export async function updateStudent(userId: string, studentUpdate: IStudentUpdateDTO) {
    await axios.put(endpoints.user.updateStudent(userId), studentUpdate)
    return userId
}

export async function updateTeacher(userId: string, teacherUpdate: ITeacherUpdateDTO) {
    await axios.put(endpoints.user.updateTeacher(userId), teacherUpdate)
    return userId
}

export async function deleteUser(userId: string) {
    await axios.delete(endpoints.user.deleteById(userId))
    return userId
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

interface IUserUpdateDTO {
    lastName: string
    firstName: string
    email: string
    roleId: string
}

export interface IStudentUpdateDTO extends IUserUpdateDTO {
    cluster: string
    degree: string
    faculty: string
    graduateDate: string
}

export interface ITeacherUpdateDTO extends IUserUpdateDTO {
    generalBachelor: number
    generalMaster: number
}
