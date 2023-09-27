import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import {
    ITeacherRequestDTO,
    useGetAllTeachers,
    useGetRequestsStudent,
    useGetRequestsTeacher,
} from '~/backend'
import { Button, DisplayError, Loading } from '~/components'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { RequestForm } from './page-components'

export function TeacherList() {
    const [showRequestFormFor, setShowRequestFormFor] = useState<number | null>(
        null
    )

    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const getRequestsStudent = useGetRequestsStudent(accessToken)
    const getRequestsTeacher = useGetRequestsTeacher(accessToken)
    const { data: requests } = useQuery(['requests'], () => {
        if (currentUser.role === 'teacher') return getRequestsTeacher()
        else return getRequestsStudent()
    })

    const getAllTeachers = useGetAllTeachers()
    const {
        isLoading,
        error,
        data: allTeachers,
    } = useQuery({
        enabled: !!requests,
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />
    if (!allTeachers?.length)
        return (
            <h2 className='text-center text-2xl'>
                В системі немає жодного вчителя
            </h2>
        )
    const data = allTeachers.filter((t) =>
        requests?.every((r) => r.user.id !== t.teacherId)
    )
    if (!data?.length)
        return (
            <h2 className='text-center text-2xl'>
                Запрошення були надіслані до усіх вчителів
            </h2>
        )

    return (
        <div className='mx-auto flex w-full max-w-md flex-col gap-8'>
            {data.map((teacher) => (
                <Fragment key={teacher.teacherId}>
                    <TeacherInfoRow
                        teacher={teacher}
                        showRequestForm={
                            showRequestFormFor === teacher.teacherId
                        }
                        setShowRequestFormFor={(setFor) =>
                            setShowRequestFormFor((curValue) => {
                                if (curValue === setFor) return null
                                else return setFor
                            })
                        }
                    />
                </Fragment>
            ))}
        </div>
    )
}

function TeacherInfoRow({
    teacher,
    showRequestForm,
    setShowRequestFormFor,
}: {
    teacher: ITeacherRequestDTO
    showRequestForm: boolean
    setShowRequestFormFor: (setFor: number) => void
}) {
    return (
        <div className='flex flex-col border-b border-b-cs-additional-gray pb-4'>
            <div className='flex flex-row justify-between'>
                <div className='text-lg font-semibold'>
                    {teacher.lastName} {teacher.firstName}
                </div>
                <Button
                    preset='icon'
                    className={`m-0 mt-0.5 h-4 w-4 rounded-none p-0 outline-none focus:outline-none ${
                        showRequestForm
                            ? 'text-cs-secondary'
                            : 'text-cs-text-dark'
                    }`}
                    onClick={() => setShowRequestFormFor(teacher.teacherId)}
                    icon={<i className='ri-send-plane-fill' />}
                />
            </div>
            {showRequestForm && <RequestForm userId={teacher.teacherId} />}
        </div>
    )
}