import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { ITeacherRequestDTO, useGetAllTeachers } from '~/backend'
import { DisplayError, Loading } from '~/components'

export function TeacherList() {
    const getAllTeachers = useGetAllTeachers()
    const { isLoading, error, data } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            return getAllTeachers()
        },
    })

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />
    if (!data?.length)
        return <h2 className='text-2xl'>Немає жодного студента</h2>

    return (
        <div className='mx-auto flex w-[420px] flex-col gap-4'>
            {data.map((teacher, idx) => (
                <Fragment key={idx}>
                    <TeacherInfoRow teacher={teacher} />
                </Fragment>
            ))}
        </div>
    )
}

function TeacherInfoRow({ teacher }: { teacher: ITeacherRequestDTO }) {
    return (
        <div className='my-1 grid gap-2 border-b py-1'>
            <div className='text-lg font-semibold'>
                {teacher.lastName} {teacher.firstName}
            </div>
        </div>
    )
}
