import axios from 'axios'
import { toast } from 'react-toastify'
import { endpoints } from './endpoints'
import { useAuthStore } from '~/store/authStore.ts'

export interface ISignInForm {
    email: string
    password: string
    rememberMe: boolean
}

export function useSignIn() {
    const authStore = useAuthStore()
    return (form: ISignInForm) => {
        axios
            .post(endpoints.signIn, form)
            .then(({ data }) => {
                const accessToken = data['accessToken']
                if (accessToken satisfies string) {
                    authStore.setAccessToken(accessToken)
                    toast('Signed in successfully!')
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
