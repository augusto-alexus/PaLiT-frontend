import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useGetStudentDocuments } from '~/backend/file.ts'
import { DisplayError, FileInput, Loading } from '~/components'
import { routes } from '~/pages/index.ts'
import { useAuthStore } from '~/store/authStore.ts'

export function Files() {
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const getStudentDocuments = useGetStudentDocuments()

    const { isLoading, error, data, isFetching } = useQuery({
        enabled: authStore.currentUser?.role === 'student',
        queryKey: [
            'currentUser',
            'studentDocuments',
            authStore.currentUser?.studentId,
        ],
        queryFn: async () => {
            if (!authStore.currentUser?.studentId)
                throw new Error("Can't load document list: no authorized user.")
            return getStudentDocuments(authStore.currentUser.studentId)
        },
    })

    if (authStore.currentUser?.role === 'teacher')
        return (
            <h2 className={'text-2xl'}>
                Перегляд та завантаження власних файлів доступне лише студентам
            </h2>
        )

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />

    return (
        <div className='my-24'>
            {data?.length ? (
                <div className='relative flex place-content-center  '>
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
                                        navigate(
                                            `../${routes.home.filePreview(
                                                row.documentId
                                            )}`,
                                            {
                                                relative: 'route',
                                            }
                                        )
                                    }
                                >
                                    <td className='px-4 py-1'>{idx + 1}</td>
                                    <td className='px-4 py-1'>
                                        {row.originalName}
                                    </td>
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
            ) : (
                <h3 className='text-center text-3xl text-cs-text-dark'>
                    Наразі Ви не завантажили жодного файлу.
                </h3>
            )}
            <div className='mt-16'>
                <FileInput />
            </div>
        </div>
    )
}
