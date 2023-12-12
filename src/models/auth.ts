import { IStudentSignUpDTO, ITeacherSignUpDTO } from '~/backend'

export interface ISignUpForm {
    lastName: string
    firstName: string
    email: string
    password: string
    confirmPassword: string
    isStudent: boolean
    gradDate: string
    gradLevel: string
    group: string
    faculty: string
}

export function getTeacherSignUpDTO(form: ISignUpForm): ITeacherSignUpDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
    }
}

export function getStudentSignUpDTO(form: ISignUpForm): IStudentSignUpDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        cluster: form.group,
        faculty: form.faculty,
        graduateDate: form.gradDate,
        degree: form.gradLevel,
    }
}
