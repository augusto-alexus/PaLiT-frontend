import axios, { AxiosError } from 'axios'
import { Role } from '~/models'
import { getAuthConfig } from './base'
import endpoints from './endpoints'
import { IFullUserInfoDTO } from './user.ts'

export class JWTExpiredError extends Error {}

export async function getCurrentUser(accessToken: string) {
    return axios
        .get(
            endpoints.currentUser,
            getAuthConfig(accessToken, {
                data: {
                    user: accessToken,
                },
            })
        )
        .then(({ data }) => data as IFullUserInfoDTO)
        .catch((error: AxiosError) => {
            if (error.response?.status === 401) throw new JWTExpiredError()
            else throw error
        })
}

export async function signIn(form: ISignInDTO) {
    const response = await axios.post(endpoints.signIn, form)
    return response.data as { accessToken: string }
}

export function signUpStudent(dto: IStudentSignUpDTO) {
    return axios.post(endpoints.signUpStudent, dto)
}

export function signUpTeacher(dto: ITeacherSignUpDTO) {
    return axios.post(endpoints.signUpTeacher, dto)
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
}
