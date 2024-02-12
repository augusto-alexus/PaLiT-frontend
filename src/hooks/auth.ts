import { useAuthStore } from '~/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getStudentSignUpDTO, getTeacherSignUpDTO, ISignUpStudentForm, ISignUpTeacherForm } from '~/models'
import { signIn, signUpStudent, signUpTeacher } from '~/backend'
import { toast } from '~/components'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

export function useAccessToken() {
    const authStore = useAuthStore()
    if (!authStore.accessToken) throw new Error('Access token is empty')
    return authStore.accessToken
}

export function useCurrentUser() {
    const authStore = useAuthStore()
    if (!authStore.currentUser) throw new Error('Current user is empty')
    return authStore.currentUser
}

export function useTeacherSignUp(onSuccess?: () => void) {
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (form: ISignUpTeacherForm) => signUpTeacher(getTeacherSignUpDTO(form)),
        onSuccess,
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    toast(`${t('error.userWithEmailExists')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}

export function useStudentSignUp(onSuccess?: () => void) {
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (form: ISignUpStudentForm) => signUpStudent(getStudentSignUpDTO(form)),
        onSuccess,
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    toast(`${t('error.userWithEmailExists')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}

export function useSignIn(onSuccess?: () => void) {
    const { t } = useTranslation()
    const authStore = useAuthStore()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => signIn({ email, password }),
        onSuccess: async ({ accessToken }) => {
            authStore.reset()
            authStore.setAccessToken(accessToken)
            await queryClient.resetQueries()
            onSuccess?.()
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    toast(`${t('error.wrongCredentials')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}
