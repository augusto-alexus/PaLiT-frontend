import axios from 'axios'
import { endpoints } from './endpoints'
import { toast } from '~/components'

export interface ISignUpForm {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    isStudent: boolean
    faculty: string
    group: string
    gradYear: string
    gradLevel: string
}

interface ITeacherSignUpDTO {
    firstName: string
    lastName: string
    email: string
    password: string
}

function getTeacherSignUpDTO(form: ISignUpForm): ITeacherSignUpDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
    }
}

interface IStudentSignUpDTO extends ITeacherSignUpDTO {
    cluster: string
    faculty: string
    graduateDate: string
    degree: string
}

function getStudentSignUpDTO(form: ISignUpForm): IStudentSignUpDTO {
    return {
        ...getTeacherSignUpDTO(form),
        cluster: form.group,
        faculty: form.faculty,
        graduateDate: form.gradYear,
        degree: form.gradLevel.toUpperCase(),
    }
}

export function useSignUp(onSuccess?: () => void) {
    return (form: ISignUpForm) => {
        if (form.password !== form.confirmPassword) {
            toast('Password not confirmed!')
            return
        }
        if (form.isStudent) {
            axios
                .post(endpoints.signUpStudent, getStudentSignUpDTO(form))
                .then(() => {
                    toast('Signed up successfully!')
                    onSuccess?.()
                })
                .catch((err) => {
                    toast(`Error! ${err}`)
                })
        } else {
            axios
                .post(endpoints.signUpTeacher, getTeacherSignUpDTO(form))
                .then(() => {
                    toast('Signed up successfully!')
                    onSuccess?.()
                })
                .catch((err) => {
                    toast(`Error! ${err}`)
                })
        }
    }
}
