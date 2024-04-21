import { useAuthStore } from '~/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getStudentSignUpDTO, getTeacherSignUpDTO, ISignUpStudentForm, ISignUpTeacherForm } from '~/models'
import { signIn, signUpStudent, signUpTeacher } from '~/backend'
import { useErrorHandler } from '~/hooks'

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
    const errorHandler = useErrorHandler()
    return useMutation({
        mutationFn: ({ form, token }: { form: ISignUpTeacherForm; token: string }) =>
            signUpTeacher(getTeacherSignUpDTO(form, token)),
        onSuccess,
        onError: errorHandler,
    })
}

export function useStudentSignUp(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
    return useMutation({
        mutationFn: ({ form, token }: { form: ISignUpStudentForm; token: string }) =>
            signUpStudent(getStudentSignUpDTO(form, token)),
        onSuccess,
        onError: errorHandler,
    })
}

export function useSignIn(onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
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
        onError: errorHandler,
    })
}
