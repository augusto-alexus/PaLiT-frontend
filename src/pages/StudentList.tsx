import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { IStudentRequestDTO, useGetAllStudents } from '~/backend'
import { DisplayError, Loading } from '~/components'

export function StudentList() {
    const getAllStudents = useGetAllStudents()
    const { isLoading, error, data } = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            return getAllStudents()
        },
    })

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />
    if (!data?.length)
        return <h2 className='text-2xl'>Немає жодного студента</h2>

    return (
        <div className='mx-auto flex w-[420px] flex-col gap-4'>
            {data.map((student, idx) => (
                <Fragment key={idx}>
                    <StudentInfoRow student={student} />
                </Fragment>
            ))}
        </div>
    )
}

function StudentInfoRow({ student }: { student: IStudentRequestDTO }) {
    return (
        <div className='my-1 grid grid-cols-2 gap-2 border-b py-1'>
            <div className='text-lg font-semibold'>
                {student.lastName} {student.firstName}
            </div>
            <div className='place-self-end font-mono text-cs-text-neutral'>
                {student.faculty}
            </div>
            <div>{student.degree}</div>
            <div className='place-self-end font-mono text-cs-text-neutral'>
                {student.cluster}
            </div>
        </div>
    )
}
