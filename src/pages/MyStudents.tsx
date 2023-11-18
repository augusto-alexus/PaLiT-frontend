import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getMyStudents, IMyStudent } from '~/backend'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { routes } from '~/pages/routes.ts'

export function MyStudents() {
    const { t } = useTranslation()
    const { role, bachelorStudentsLimit, masterStudentsLimit } =
        useCurrentUser()
    const accessToken = useAccessToken()
    const { data } = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents'],
        queryFn: () => getMyStudents(accessToken),
    })
    if (role !== 'teacher') return <Navigate to={`/${routes.authRedirect}`} />
    const anyStudents = !!data?.length
    if (!anyStudents)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('workNotStarted.title')}
                </div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={`/${routes.studentList}`}>
                        {t('workNotStarted.invite')}
                    </Link>{' '}
                    {t('workNotStarted.studentOr')}
                    <Link to={`/${routes.invitations}`}>
                        {' '}
                        {t('workNotStarted.accept')}
                    </Link>{' '}
                    {t('workNotStarted.theRestForTeacher')}
                </div>
            </div>
        )

    const bachelorStudentCount = data.filter(
        (s) => s.student.degree === 'bachelor'
    ).length
    const additionalBachelors = bachelorStudentsLimit
        ? Math.max(0, bachelorStudentsLimit - bachelorStudentCount - 1)
        : 0
    const masterStudentCount = data.filter(
        (s) => s.student.degree === 'master'
    ).length
    const additionalMasters = masterStudentsLimit
        ? Math.max(0, masterStudentsLimit - masterStudentCount - 1)
        : 0

    return (
        <div className='flex w-full flex-col gap-12'>
            <h2 className='text-center text-2xl font-semibold'>
                {t('yourStudents')}
            </h2>
            <div className='flex flex-col place-items-center gap-8'>
                {data.map((myStudent) => (
                    <MyStudentInfoRow
                        key={myStudent.student.studentId}
                        myStudent={myStudent}
                    />
                ))}
            </div>
            {additionalBachelors > 0 && (
                <div className='text-center font-mono'>
                    {t('youCanTeachAdditionally')} {additionalBachelors}{' '}
                    {additionalBachelors > 1
                        ? t('multipleStudentBachelor')
                        : t('singularStudentBachelor')}
                </div>
            )}
            {additionalMasters > 0 && (
                <div className='text-center font-mono'>
                    {t('youCanTeachAdditionally')} {additionalMasters}{' '}
                    {additionalMasters > 1
                        ? t('multipleStudentMaster')
                        : t('singularStudentMaster')}
                </div>
            )}
        </div>
    )
}

function MyStudentInfoRow({ myStudent }: { myStudent: IMyStudent }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { student } = myStudent
    return (
        <div
            onClick={() => navigate(`/${routes.myStudent(student.studentId)}`)}
            className='flex w-full max-w-sm flex-col rounded-t-3xl border-b border-b-cs-additional-gray p-4 pb-4 hover:cursor-pointer hover:bg-cs-bg-neutral'
        >
            <div className='my-1 grid grid-cols-5 gap-2'>
                <div className='col-span-3 text-lg font-semibold'>
                    {student.lastName} {student.firstName}
                </div>
                <div className='col-span-2 place-self-end font-mono text-cs-text-neutral'>
                    {student.faculty}
                </div>
                <div className='col-span-3'>
                    {t(`degrees.${student.degree}`)}
                </div>
                <div className='col-span-2 place-self-end font-mono text-cs-text-neutral'>
                    {student.cluster}
                </div>
                <div className='col-span-5 text-xl'>
                    <span className='font-mono'>{t('theme')}</span>:{' '}
                    <span className='font-semibold'>«{myStudent.theme}»</span>
                </div>
                <div className='text-md col-span-3'>
                    <span className='font-mono'>{t('language')}</span>:{' '}
                    <span className='font-semibold'>{myStudent.language}</span>
                </div>
                <div className='text-md col-span-5 mt-2 text-center text-cs-warning'>
                    {t('hodRequestNotApproved')}
                </div>
            </div>
        </div>
    )
}
