import { AxiosError } from 'axios'
import { Role } from '~/models'
import endpoints from './endpoints'
import { IFullUserInfoDTO } from './user.ts'
import axios, { axiosTokenlessInstance, updateAxiosInstanceToken } from './base.ts'
import {
    EmailAlreadyExistsError,
    PasswordsDoNotMatchError,
    UnknownError,
    WrongCredentialsError,
} from '~/backend/error.ts'

export class JWTExpiredError extends Error {}

export async function getCurrentUser(accessToken: string) {
    return axios
        .get(endpoints.currentUser, {
            data: {
                user: accessToken,
            },
        })
        .then(({ data }) => data as IFullUserInfoDTO)
        .catch((error: AxiosError) => {
            if (error.response?.status === 401) throw new JWTExpiredError()
            else throw error
        })
}

export async function signIn(form: ISignInDTO) {
    return axiosTokenlessInstance
        .post(endpoints.signIn, form)
        .then(({ data }) => {
            const accessToken = (data as { accessToken: string }).accessToken
            updateAxiosInstanceToken(accessToken)
            return { accessToken }
        })
        .catch((error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) throw new WrongCredentialsError()
                else throw new UnknownError(error.message)
            }
            throw new UnknownError()
        })
}

export function logOut() {
    axios.defaults.headers.common = {}
}

export async function signUpStudent(dto: IStudentSignUpDTO) {
    return axios.post(endpoints.signUpStudent, dto).catch((error) => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) throw new EmailAlreadyExistsError()
            else if (error.response?.status === 400) throw new PasswordsDoNotMatchError()
            else throw new UnknownError(error.message)
        }
        throw new UnknownError()
    })
}

export async function signUpTeacher(dto: ITeacherSignUpDTO) {
    return axios.post(endpoints.signUpTeacher, dto).catch((error) => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) throw new EmailAlreadyExistsError()
            else if (error.response?.status === 400) throw new PasswordsDoNotMatchError()
            else throw new UnknownError(error.message)
        }
        throw new UnknownError()
    })
}

export async function getAllRoles() {
    const response = await axios.get(endpoints.role.getAll)
    return response.data as IRoleDTO[]
}

export interface IRoleDTO {
    id: string
    name: Role
}

interface ISignInDTO {
    email: string
    password: string
}

export interface IStudentSignUpDTO extends ITeacherSignUpDTO {
    cluster: string
    faculty: string
    graduateDate: string
    degree: string
}

export interface ITeacherSignUpDTO {
    firstName: string
    lastName: string
    email: string
    password: string
    token?: string
}

export interface IHodTeacherCreateDTO extends ITeacherSignUpDTO {
    generalBachelor: number
    generalMaster: number
}
