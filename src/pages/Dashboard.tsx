import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Loading } from '~/components'
import {
    useAllHoDRequests,
    useAllStudents,
    useAllTeachers,
    useCurrentUser,
} from '~/hooks'
import { IHoDRequest, IStudent, ITeacher } from '~/models'
import { routes } from '~/pages/routes.ts'

export function Dashboard() {
    const { t } = useTranslation()
    const { role } = useCurrentUser()

    const { data: allRequests, isLoading: isLoadingRequests } =
        useAllHoDRequests()
    const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents()
    const { data: allTeachers, isLoading: isLoadingTeachers } = useAllTeachers()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    if (!allRequests)
        return (
            <h2 className='text-center text-2xl font-semibold'>
                {t('dashboard.noRequests')}
            </h2>
        )

    if (isLoadingRequests || isLoadingStudents || isLoadingTeachers)
        return <Loading />

    return (
        <div className='flex w-full flex-col gap-12'>
            <h2 className='text-center text-2xl font-semibold'>
                {t('dashboard.requests')}
            </h2>
            <div className='mx-auto flex w-1/3 flex-col gap-4'>
                {allRequests.map((request) => (
                    <ProjectRequest
                        key={request.id}
                        request={request}
                        student={allStudents?.find(
                            (s) => s.studentId === request.studentId
                        )}
                        teacher={allTeachers?.find(
                            (s) => s.teacherId === request.teacherId
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

function ProjectRequest({
    request,
    student,
    teacher,
}: {
    request: IHoDRequest
    student?: IStudent
    teacher?: ITeacher
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
        <div className='grid grid-cols-6'>
            <div className='col-span-3 text-lg font-semibold'>
                {t('dashboard.student')}
            </div>
            <div className='col-span-3 text-lg font-semibold'>
                {t('dashboard.supervisor')}
            </div>
            <div className='col-span-3 text-lg'>
                {student.lastName} {student.firstName}
            </div>
            <div className='col-span-3 text-lg'>
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
            <div className='text-md col-span-6'>
                {t('dashboard.language')}: {t(`languages.${request.language}`)}
            </div>
        </div>
    )
}
