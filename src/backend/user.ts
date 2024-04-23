import endpoints from './endpoints'
import { IRoleDTO, IStudentSignUpDTO, ITeacherSignUpDTO } from './auth'
import axios from './base.ts'
import { EmailAlreadyExistsError, handleError, UserCantBeDeletedError } from '~/backend/error.ts'

export async function getAllUsers() {
    return axios
        .get(endpoints.user.getAll)
        .then(({ data }) => data as IUser[])
        .catch(handleError())
}

export async function getUserById(id: string) {
    return axios
        .get(endpoints.user.getById(id))
        .then(({ data }) => data as IFullUserInfoDTO)
        .catch(handleError())
}

export async function createStudent(studentCreate: IStudentSignUpDTO) {
    return axios
        .post(endpoints.user.createStudent, studentCreate)
        .then(({ data }) => data as object)
        .catch(
            handleError(({ status }) => {
                if (status === 409) throw new EmailAlreadyExistsError()
            })
        )
}

export async function createTeacher(teacherCreate: ITeacherSignUpDTO) {
    return axios
        .post(endpoints.user.createTeacher, teacherCreate)
        .then(({ data }) => data as object)
        .catch(
            handleError(({ status }) => {
                if (status === 409) throw new EmailAlreadyExistsError()
            })
        )
}

export async function updateStudent(userId: string, studentUpdate: IStudentUpdateDTO) {
    return axios
        .put(endpoints.user.updateStudent(userId), studentUpdate)
        .then(() => userId)
        .catch(
            handleError(({ status }) => {
                if (status === 409) throw new EmailAlreadyExistsError()
            })
        )
}

export async function updateTeacher(userId: string, teacherUpdate: ITeacherUpdateDTO) {
    return axios
        .put(endpoints.user.updateTeacher(userId), teacherUpdate)
        .then(() => userId)
        .catch(
            handleError(({ status }) => {
                if (status === 409) throw new EmailAlreadyExistsError()
            })
        )
}

export async function deleteUser(userId: string) {
    return axios
        .delete(endpoints.user.deleteById(userId))
        .then(() => userId)
        .catch(
            handleError(({ status }) => {
                if (status === 403) throw new UserCantBeDeletedError()
            })
        )
}

export interface IUser {
    userId: number
    role: IRoleDTO
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
