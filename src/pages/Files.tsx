import { useQuery } from '@tanstack/react-query'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { IMyStudent } from '~/backend'
import { useGetStudentDocuments } from '~/backend/file.ts'
import { DisplayError, FileUpload, Loading } from '~/components'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function Files() {
    const navigate = useNavigate()
    const { role, id, studentId } = useCurrentUser()
    const outletContext = useOutletContext<{ myStudent?: IMyStudent }>()
    const getStudentDocuments = useGetStudentDocuments()

    const { isLoading, error, data, isFetching } = useQuery({
        enabled: role === 'student' || !!outletContext?.myStudent,
        queryKey: [
            'studentDocuments',
            outletContext?.myStudent?.student.studentId || id,
        ],
        queryFn: async () => {
            const myStudentId = outletContext?.myStudent?.student.studentId
            const myId = studentId
            if (myStudentId) return getStudentDocuments(myStudentId)
            else if (myId) return getStudentDocuments(myId)
            throw new Error("Can't load document list: no authorized user.")
        },
    })

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
                                    className='hover:cursor-pointer hover:bg-cs-bg-neutral'
                                    onClick={() =>
                                        navigate(
                                            routes.filePreview(row.documentId)
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
                    {role === 'teacher'
                        ? 'Наразі  студент не завантажив жодного файлу'
                        : 'Наразі Ви не завантажили жодного файлу.'}
                </h3>
            )}
            {role === 'student' && (
                <div className='mt-16'>
                    <FileUpload />
                </div>
            )}
        </div>
    )
}
