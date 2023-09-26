import axios, { AxiosError } from 'axios'
import { toast } from '~/components'
import {
    ICurrentUserDTO,
    ISignInDTO,
    IStudentSignUpDTO,
    ITeacherSignUpDTO,
} from './auth.types.ts'
import endpoints from './endpoints'

export class JWTExpiredError extends Error {}

export async function getCurrentUser(accessToken: string) {
    return axios
        .get(endpoints.currentUser, {
            data: {
                user: accessToken,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(({ data }) => data as ICurrentUserDTO)
        .catch((error: AxiosError) => {
            if (error.response?.status === 401) throw new JWTExpiredError()
            else throw error
        })
}

export async function signIn(form: ISignInDTO) {
    const response = await axios.post(endpoints.signIn, form)
    return response.data as { accessToken: string }
}

export function useSignUpStudent(onSuccess?: () => void) {
    return (dto: IStudentSignUpDTO) =>
        axios.post(endpoints.signUpStudent, dto).then(() => {
            toast('Реєстрація успішна!')
            onSuccess?.()
        })
}

export function useSignUpTeacher(onSuccess?: () => void) {
    return (dto: ITeacherSignUpDTO) =>
        axios.post(endpoints.signUpTeacher, dto).then(() => {
            toast('Реєстрація успішна!')
            onSuccess?.()
        })
}
