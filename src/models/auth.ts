import { IStudentSignUpDTO, ITeacherSignUpDTO } from '~/backend'

export interface ISignUpTeacherForm {
    lastName: string
    firstName: string
    email: string
    password: string
    confirmPassword: string
}

export interface ISignUpStudentForm extends ISignUpTeacherForm {
    gradDate: string
    gradLevel: string
    group: string
    faculty: string
}

export function getTeacherSignUpDTO(form: ISignUpTeacherForm, token: string): ITeacherSignUpDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        token,
    }
}

export function getStudentSignUpDTO(form: ISignUpStudentForm, token: string): IStudentSignUpDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        cluster: form.group,
        faculty: form.faculty,
        graduateDate: form.gradDate,
        degree: form.gradLevel,
        token,
    }
}
