import { Role } from '~/models'
import endpoints from './endpoints'
import { IFullUserInfoDTO } from './user.ts'
import axios, { axiosTokenlessInstance, updateAxiosInstanceToken } from './base.ts'
import {
    EmailAlreadyExistsError,
    handleError,
    JWTExpiredError,
    PasswordsDoNotMatchError,
    WrongCredentialsError,
} from './error.ts'

export async function getCurrentUser(accessToken: string) {
    return axios
        .get(endpoints.currentUser, {
            data: {
                user: accessToken,
            },
        })
        .then(({ data }) => data as IFullUserInfoDTO)
        .catch(
            handleError(({ status }) => {
                if (status === 401) throw new JWTExpiredError()
            })
        )
}

export async function signIn(form: ISignInDTO) {
    return axiosTokenlessInstance
        .post(endpoints.signIn, form)
        .then(({ data }) => {
            const accessToken = (data as { accessToken: string }).accessToken
            updateAxiosInstanceToken(accessToken)
            return { accessToken }
        })
        .catch(
            handleError(({ status }) => {
                if (status === 403) throw new WrongCredentialsError()
            })
        )
}

export function logOut() {
    axios.defaults.headers.common = {}
}

export async function signUpStudent(dto: IStudentSignUpDTO) {
    return axios.post(endpoints.signUpStudent, dto).catch(
        handleError(({ status }) => {
            if (status === 409) throw new EmailAlreadyExistsError()
            else if (status === 400) throw new PasswordsDoNotMatchError()
        })
    )
}

export async function signUpTeacher(dto: ITeacherSignUpDTO) {
    return axios.post(endpoints.signUpTeacher, dto).catch(
        handleError(({ status }) => {
            if (status === 409) throw new EmailAlreadyExistsError()
            else if (status === 400) throw new PasswordsDoNotMatchError()
        })
    )
}

export async function getAllRoles() {
    return axios
        .get(endpoints.role.getAll)
        .then(({ data }) => data as IRoleDTO[])
        .catch(handleError())
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
