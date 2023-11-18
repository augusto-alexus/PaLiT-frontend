import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllTeachers, getRequests, ITeacherRequestDTO } from '~/backend'
import { Button, DisplayError, Loading } from '~/components'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { useMyProject } from '~/hooks/useMyProject.ts'
import { RequestForm } from './page-components'

export function TeacherList() {
    const { t } = useTranslation()
    const [showRequestFormFor, setShowRequestFormFor] = useState<number | null>(
        null
    )

    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const { data: requests } = useQuery(['requests'], () =>
        getRequests(accessToken, currentUser.role)
    )

    const {
        isLoading,
        error,
        data: allTeachers,
    } = useQuery({
        enabled: !!requests,
        queryKey: ['teachers'],
        queryFn: getAllTeachers,
    })

    const { myProjectStarted } = useMyProject()

    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />
    if (!allTeachers?.length)
        return (
            <h2 className='text-center text-2xl font-semibold'>
                {t('noTeachersInTheSystem')}
            </h2>
        )
    const data = allTeachers.filter((t) =>
        requests?.every((r) => r.user.id !== t.teacherId)
    )
    if (!data?.length)
        return (
            <h2 className='text-center text-2xl font-semibold'>
                {t('everyTeacherReceivedInvitation')}
            </h2>
        )

    return (
        <div className='mx-auto flex w-full max-w-md flex-col gap-8'>
            {data.map((teacher) => (
                <Fragment key={teacher.teacherId}>
                    <TeacherInfoRow
                        teacher={teacher}
                        canMakeRequest={!myProjectStarted}
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
    canMakeRequest,
    showRequestForm,
    setShowRequestFormFor,
}: {
    teacher: ITeacherRequestDTO
    canMakeRequest: boolean
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
                    hidden={!canMakeRequest}
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
