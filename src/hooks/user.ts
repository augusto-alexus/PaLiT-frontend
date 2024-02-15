import { MutationFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createStudent,
    createTeacher,
    deleteUser,
    getAllUsers,
    getUserById,
    IStudentSignUpDTO,
    IStudentUpdateDTO,
    ITeacherSignUpDTO,
    ITeacherUpdateDTO,
    updateStudent,
    updateTeacher,
} from '~/backend'
import { AxiosError } from 'axios'
import { toast } from '~/components'
import { useTranslation } from 'react-i18next'

export function useAllUsers() {
    const { data: users, ...rest } = useQuery({
        queryFn: getAllUsers,
        queryKey: ['users'],
    })
    return { users, ...rest }
}

export function useUserById(id: string | null | undefined) {
    const { data: user, ...rest } = useQuery({
        enabled: !!id,
        queryFn: () => {
            if (id) return getUserById(id)
        },
        queryKey: ['user', id],
    })
    return { user, ...rest }
}

function useUserCreate<Args, Out>(mutationFn: MutationFunction<Args, Out>, onSuccess?: () => void) {
    const { t } = useTranslation()
    return useMutation({
        mutationFn,
        onSuccess: () => onSuccess?.(),
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}

export function useStudentCreate(onSuccess?: () => void) {
    return useUserCreate(
        async ({ studentCreate }: { studentCreate: IStudentSignUpDTO }) => createStudent(studentCreate),
        onSuccess
    )
}

export function useTeacherCreate(onSuccess?: () => void) {
    return useUserCreate(
        async ({ teacherCreate }: { teacherCreate: ITeacherSignUpDTO }) => createTeacher(teacherCreate),
        onSuccess
    )
}

function useUserUpdate<Args, Out>(mutationFn: MutationFunction<Out, Args>, onSuccess?: () => void) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn,
        onSuccess: async (userId) => {
            await queryClient.invalidateQueries(['user', userId])
            onSuccess?.()
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                if (error?.response?.status === 409) {
                    toast(`${t('error.userWithEmailExists')}!`)
                } else toast(`${t('error.unknownError')}! ${error.message}`)
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}

export function useStudentUpdate(onSuccess?: () => void) {
    return useUserUpdate(
        async ({ userId, studentUpdate }: { userId: string; studentUpdate: IStudentUpdateDTO }) =>
            updateStudent(userId, studentUpdate),
        onSuccess
    )
}

export function useTeacherUpdate(onSuccess?: () => void) {
    return useUserUpdate(
        async ({ userId, teacherUpdate }: { userId: string; teacherUpdate: ITeacherUpdateDTO }) =>
            updateTeacher(userId, teacherUpdate),
        onSuccess
    )
}

export function useDeleteUser(onSuccess?: () => void) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ userId }: { userId: string }) => deleteUser(userId),
        onSuccess: async (userId) => {
            await queryClient.invalidateQueries(['users'])
            await queryClient.invalidateQueries(['user', userId])
            onSuccess?.()
        },
        onError: (error: AxiosError | never) => {
            if (error instanceof AxiosError) {
                if (error?.response?.status === 403) {
                    toast(`${t('error.userCantBeDelete')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
}
