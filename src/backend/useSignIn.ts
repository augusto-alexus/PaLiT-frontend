import axios from 'axios'
import { toast } from '~/components'
import { endpoints } from './endpoints'
import { useAuthStore } from '~/store/authStore.ts'

export interface ISignInForm {
    email: string
    password: string
    rememberMe: boolean
}

interface ISignInDTO {
    email: string
    password: string
}

function getSignInDTO(form: ISignInForm): ISignInDTO {
    return {
        email: form.email,
        password: form.password,
    }
}

export function useSignIn(onSuccess?: () => void) {
    const authStore = useAuthStore()
    return (form: ISignInForm) => {
        axios
            .post(endpoints.signIn, getSignInDTO(form))
            .then(({ data }) => {
                const accessToken = data['accessToken']
                if (accessToken satisfies string) {
                    authStore.setAccessToken(accessToken)
                    toast('Signed in successfully!')
                    onSuccess?.()
                } else toast('Unexpected type for "accessToken"')
            })
            .catch((err) => {
                toast(`Error! ${err}`)
            })
    }
}
