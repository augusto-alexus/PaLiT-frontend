import { useAuthStore } from '~/store/authStore.ts'
import { useGetStudentDocuments } from '~/backend/file'
import { useQuery } from '@tanstack/react-query'

export function FileList() {
    const authStore = useAuthStore()
    const getStudentDocuments = useGetStudentDocuments()

    const { isLoading, error, data, isFetching } = useQuery({
        enabled:
            authStore.currentUser !== null &&
            !!authStore.currentUser.studentDTO?.studentId,
        queryKey: [
            'studentDocuments',
            authStore.currentUser?.studentDTO?.studentId || '???',
        ],
        queryFn: async () => {
            if (authStore.currentUser === null)
                throw new Error("Can't load document list: no authorized user.")
            return getStudentDocuments(
                authStore.currentUser.studentDTO.studentId
            )
        },
    })

    if (isLoading) return <h2>Loading document list...</h2>

    if (error && error instanceof Error)
        return (
            <h2>
                Error occurred while loading documents list: ${error.message}
            </h2>
        )
    if (error)
        return <h2>Unknown error occurred while loading documents list</h2>

    return (
        <div>
            <h2>Documents:</h2>
            <div>{JSON.stringify(data, undefined, 2)}</div>
            {isFetching && <div>fetching...</div>}
        </div>
    )
}
