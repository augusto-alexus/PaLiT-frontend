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
import { useErrorHandler } from '~/hooks/error.ts'

export function useAllUsers() {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        queryFn: getAllUsers,
        queryKey: ['users'],
    })
    if (query.isError) errorHandler(query.error)
    return query
}

export function useUserById(id: string | null | undefined) {
    const errorHandler = useErrorHandler()
    const query = useQuery({
        enabled: !!id,
        queryFn: () => {
            if (id) return getUserById(id)
        },
        queryKey: ['user', id],
    })
    if (query.isError) errorHandler(query.error)
    return query
}

function useUserCreate<Args, Out>(mutationFn: MutationFunction<Args, Out>, onSuccess?: () => void) {
    const errorHandler = useErrorHandler()
    return useMutation({
        mutationFn,
        onSuccess: () => onSuccess?.(),
        onError: errorHandler,
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
    const errorHandler = useErrorHandler()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn,
        onSuccess: async (userId) => {
            await queryClient.invalidateQueries(['user', userId])
            onSuccess?.()
        },
        onError: errorHandler,
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
    const errorHandler = useErrorHandler()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ userId }: { userId: string }) => deleteUser(userId),
        onSuccess: async (userId) => {
            await queryClient.invalidateQueries(['users'])
            await queryClient.invalidateQueries(['user', userId])
            onSuccess?.()
        },
        onError: errorHandler,
    })
}
