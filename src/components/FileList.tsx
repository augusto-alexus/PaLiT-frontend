import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '~/store/authStore.ts'
import { useGetStudentDocuments } from '~/backend/file'
import { useFileStore } from '~/store/fileStore.ts'

export function FileList() {
    const authStore = useAuthStore()
    const fileStore = useFileStore()
    const getStudentDocuments = useGetStudentDocuments()

    const { isLoading, error, data, isFetching } = useQuery({
        enabled: !!authStore.currentUser?.studentDTO?.studentId,
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

    if (isLoading)
        return (
            <div className='h-fit w-fit animate-spin'>
                <i className='ri-loader-2-line text-4xl'></i>
            </div>
        )

    if (error && error instanceof Error)
        return (
            <h2>
                Error occurred while loading documents list: ${error.message}
            </h2>
        )
    if (error)
        return <h2>Unknown error occurred while loading documents list</h2>

    if (!data?.length)
        return (
            <h3 className='text-center text-3xl text-cs-text-dark'>
                Наразі Ви не завантажили жодного файлу.
            </h3>
        )

    return (
        <div className='relative'>
            <table className='table-auto'>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Назва документа</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            className='hover:cursor-pointer hover:bg-cs-neutral'
                            onClick={() =>
                                fileStore.setPreviewDocumentId(row.documentId)
                            }
                        >
                            <td className='px-4 py-1'>{row.documentId}</td>
                            <td className='px-4 py-1'>{row.originalName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isFetching && (
                <div className='absolute flex flex-row place-items-center gap-2'>
                    <div className='h-fit w-fit animate-spin'>
                        <i className='ri-loader-2-line'></i>
                    </div>
                    <span className='align-middle'>оновлюємо...</span>
                </div>
            )}
        </div>
    )
}
