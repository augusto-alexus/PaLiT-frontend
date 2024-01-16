import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Button, Loading } from '~/components'
import {
    useAllHoDRequests,
    useAllStudents,
    useAllTeachers,
    useCurrentUser,
    useUpdateHodRequest,
} from '~/hooks'
import { IHoDRequest, IStudent, ITeacher } from '~/models'
import { routes } from '~/pages'

export function HodInvitations() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { data: allRequests, isLoading: isLoadingRequests } =
        useAllHoDRequests()
    const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents()
    const { data: allTeachers, isLoading: isLoadingTeachers } = useAllTeachers()
    const { mutate: updateHodRequest } = useUpdateHodRequest()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    const suitableRequests = allRequests?.filter(
        (r) => r.teamApproved && !r.headApproved
    )

    if (!suitableRequests || suitableRequests?.length === 0)
        return (
            <h2 className='w-full text-center text-2xl font-semibold'>
                {t('dashboard.noRequests')}
            </h2>
        )

    if (isLoadingRequests || isLoadingStudents || isLoadingTeachers)
        return <Loading />

    return (
        <div className='mx-auto flex w-10/12 gap-24'>
            <div className='flex w-full flex-col gap-12'>
                <h2 className='text-center text-2xl font-semibold'>
                    {t('dashboard.requests')}
                </h2>
                <div className='mx-auto flex w-1/2 flex-col gap-4'>
                    {suitableRequests.map((request) => (
                        <ProjectRequest
                            key={request.id}
                            request={request}
                            student={allStudents?.find(
                                (s) => s.studentId === request.studentId
                            )}
                            teacher={allTeachers?.find(
                                (s) => s.teacherId === request.teacherId
                            )}
                            onRejectRequest={(request: IHoDRequest) =>
                                updateHodRequest({
                                    requestId: request.id,
                                    approved: false,
                                })
                            }
                            onApproveRequest={(request: IHoDRequest) =>
                                updateHodRequest({
                                    requestId: request.id,
                                    approved: true,
                                })
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProjectRequest({
    request,
    student,
    teacher,
    onApproveRequest,
    onRejectRequest,
}: {
    request: IHoDRequest
    student?: IStudent
    teacher?: ITeacher
    onApproveRequest: (request: IHoDRequest) => void
    onRejectRequest: (request: IHoDRequest) => void
}) {
    const { t } = useTranslation()
    if (!student || !teacher)
        return (
            <div className='text-center font-semibold text-cs-warning'>
                {t('dashboard.requestNotEnoughInfo')}.
                <br />
                {t('dashboard.contactSupport')}.
                <br />
                Request id: {request.id}
            </div>
        )
    return (
        <div className='mb-16 grid grid-cols-6 border-b-2 border-cs-additional-gray pb-6'>
            <div className='col-span-3 text-lg font-semibold'>
                {t('dashboard.student')}
            </div>
            <div className='col-span-3 text-right text-lg font-semibold'>
                {t('dashboard.supervisor')}
            </div>
            <div className='col-span-3 text-lg'>
                {student.lastName} {student.firstName}
            </div>
            <div className='col-span-3 text-right text-lg'>
                {teacher.lastName} {teacher.firstName}
            </div>
            <div className='col-span-6 mt-4 text-lg'>
                {t(`degrees.${student.degree}`)}
            </div>
            <div className='col-span-6 text-sm'>{student.faculty}</div>
            <div className='col-span-6 text-sm'>{student.cluster}</div>
            <div className='col-span-6 mt-6 text-xl font-semibold'>
                {t('dashboard.theme')}: {request.theme}
            </div>
            <div className='text-md col-span-3'>
                {t('dashboard.language')}: {t(`languages.${request.language}`)}
            </div>
            <div className='col-span-3 ml-auto flex flex-col-reverse gap-4 lg:flex-row'>
                <Button
                    className='px-2 py-0 text-cs-warning'
                    preset='text'
                    onClick={() => onRejectRequest(request)}
                >
                    {t('dashboard.rejectRequest')}
                </Button>
                <Button
                    className='px-2 py-0'
                    preset='text'
                    onClick={() => onApproveRequest(request)}
                >
                    {t('dashboard.approveRequest')}
                </Button>
            </div>
        </div>
    )
}