import axios from 'axios'
import { toast } from 'react-toastify'
import { endpoints } from './endpoints'
import { useAuthStore } from '~/store/authStore.ts'

export interface ISignUpForm {
    fullName: string
    faculty: string
    group: string
    gradYear: string
    gradLevel: string
    password: string
    confirmPassword: string
}

export function useSignUp() {
    const authStore = useAuthStore()
    return (form: ISignUpForm) => {
        axios
            .post(endpoints.signUpTeacher, form)
            .then(({ data }) => {
                const accessToken = data['accessToken']
                if (accessToken satisfies string) {
                    authStore.setAccessToken(accessToken)
                    toast('Signed up successfully!')
                } else throw new Error('Unexpected type for "accessToken"')
            })
            .catch((err) => {
                toast(`Error! ${err}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                })
            })
    }
}
