import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRequests, IStudentDTO } from '~/backend'
import { Button, DisplayError, Loading } from '~/components'
import { useAccessToken, useAllStudents, useCurrentUser } from '~/hooks'
import { RequestForm } from '~/pages/components'

export function StudentList() {
    const { t } = useTranslation()
    const [showRequestFormFor, setShowRequestFormFor] = useState<number | null>(
        null
    )

    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const { data: requests } = useQuery(['requests'], () =>
        getRequests(accessToken, currentUser.role)
    )

    const { isLoading, error, data: allStudents } = useAllStudents()

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />
    if (!allStudents?.length)
        return (
            <h2 className='text-center text-2xl font-semibold'>
                {t('noStudentsInTheSystem')}
            </h2>
        )
    const data = allStudents.filter((t) =>
        requests?.every((r) => r.user.id !== t.studentId)
    )
    if (!data?.length)
        return (
            <h2 className='text-center text-2xl font-semibold'>
                {t('everyStudentReceivedInvitation')}
            </h2>
        )

    return (
        <div className='mx-auto flex w-[420px] flex-col gap-4'>
            {data.map((student) => (
                <StudentInfoRow
                    key={student.studentId}
                    student={student}
                    showRequestForm={showRequestFormFor === student.studentId}
                    setShowRequestFormFor={(setFor) =>
                        setShowRequestFormFor((curValue) => {
                            if (curValue === setFor) return null
                            else return setFor
                        })
                    }
                />
            ))}
        </div>
    )
}

function StudentInfoRow({
    student,
    showRequestForm,
    setShowRequestFormFor,
}: {
    student: IStudentDTO
    showRequestForm: boolean
    setShowRequestFormFor: (setFor: number) => void
}) {
    const { t } = useTranslation()
    return (
        <div className='flex max-w-md flex-col border-b pb-4'>
            <div className='my-1 grid grid-cols-5 gap-2'>
                <div className='col-span-3 text-lg font-semibold'>
                    {student.lastName} {student.firstName}
                </div>
                <div className='col-span-1 place-self-end font-mono text-cs-text-neutral'>
                    {student.faculty}
                </div>
                <Button
                    preset='icon'
                    className={`row-span-2 m-0 mt-0.5 h-4 w-4 place-self-center rounded-none p-0 outline-none focus:outline-none ${
                        showRequestForm
                            ? 'text-cs-secondary'
                            : 'text-cs-text-dark'
                    }`}
                    onClick={() => setShowRequestFormFor(student.studentId)}
                    icon={<i className='ri-send-plane-fill' />}
                />
                <div className='col-span-3'>
                    {t(`degrees.${student.degree}`)}
                </div>
                <div className='col-span-1 place-self-end font-mono text-cs-text-neutral'>
                    {student.cluster}
                </div>
            </div>
            {showRequestForm && <RequestForm userId={student.studentId} />}
        </div>
    )
}
